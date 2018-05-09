import uuid
from .config import Config
from .generate_content import generate_content
from .helper import authenticate, parse_errors, encrypt_password, get_user_info, get_subject_average
from .schemas import Login, Register
from datetime import datetime
from sanic import Blueprint
from sanic.request import Request
from sanic.response import json


api = Blueprint('api', '/api')


@api.route('/is_authenticated', methods=['POST'])
def is_authenticated(request: Request) -> json:
    token, user_id = authenticate(request)
    return json(True) if user_id else json(False)


@api.route('/register', methods=['POST'])
def register(request: Request) -> json:
    data, errors = Register().load(request.json)
    if not errors:
        response = Config.current.users.find_one({'_id': data['usercode']})
        if response:
            return json({'alert': ['User already registered']}, 403)
        token = uuid.uuid4().hex
        data['password'] = encrypt_password(data['password'])
        content = generate_content()
        data.update({'content': content})
        Config.current.users.insert_one({**data, '_id': data['usercode'], 'created_at': datetime.utcnow(),
                                         'role': 'student'})
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['usercode']})
        return json({'token': token, 'name': data['military_name']})
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/login', methods=['POST'])
def login(request: Request) -> json:
    data, errors = Login().load(request.json)
    if not errors:
        response = Config.current.users.find_one({'_id': data['usercode']})
        if not response:
            return json({'alert': ['User not registered']}, 403)
        if response['password'] != encrypt_password(data['password']):
            return json({'alert': ['Password does not match']}, 403)
        token = uuid.uuid4().hex
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['usercode']})
        return json({'token': token, 'name': response['military_name']})
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/logout', methods=['POST'])
def logout(request: Request) -> json:
    token = request.cookies.get('token')
    if Config.current.tokens.find_one({'_id': token}):
        Config.current.tokens.delete_one({'_id': token})
    return json({})


@api.route('/get_years', methods=['POST'])
def get_years(request: Request) -> json:
    user = get_user_info(request)
    years = list(map(lambda x: x, user['content']))
    return json(years)


@api.route('/get_subjects', methods=['POST'])
def get_subjects(request: Request) -> json:
    subjects = []
    user = get_user_info(request)
    for year in user['content']:
        subjects.extend(list(map(lambda x: list(x.keys())[0], user['content'][year]['scores'])))
    return json(subjects)


@api.route('/get_faults', methods=['POST'])
def get_faults(request: Request) -> json:
    data = []
    user = get_user_info(request)
    years = list(map(lambda x: x, user['content']))
    for year in years:
        data.append(user['content'][year]['faults'])
    response = {'name': 'Faults', 'labels': years, 'data': data}
    return json(response)


@api.route('/get_subject_scores', methods=['POST'])
def get_subject_scores(request: Request) -> json:
    response = []
    user = get_user_info(request)
    subjects = list(map(lambda x: x['value'], request.json))
    for year, content in user['content'].items():
        for scores in list(filter(lambda x: list(x.keys())[0] in subjects, content['scores'])):
            for subject, score in scores.items():
                response.append({'name': subject, 'labels': list(map(lambda x: x, score)),
                                 'data': list(map(lambda x: score[x], score)), 'line_name': 'Media',
                                 'line_data': list(map(lambda x: 5, score))})
    return json(response)


@api.route('/get_year_scores', methods=['POST'])
def get_year_scores(request: Request) -> json:
    response = []
    user = get_user_info(request)
    years = list(map(lambda x: x['value'], request.json))
    for year in years:
        subjects, averages = [], []
        for score in user['content'][year]['scores']:
            for subject, average in score.items():
                subjects.append(subject)
                averages.append(average['Average'])
        subjects.append('Average')
        averages.append(user['content'][year]['Average'])
        response.append({'name': year, 'labels': subjects, 'data': averages, 'line_name': 'Class Average',
                         'line_data': get_subject_average(year)})
    return json(response)
