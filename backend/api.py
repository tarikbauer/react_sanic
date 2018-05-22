import uuid
from .config import Config
from .generate_content import generate_content
from .helper import authenticate, parse_errors, encrypt_password, get_user_info, get_subject_average, get_test_average
from .schemas import Login, Register, Usercode
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
        admin_token = data.pop('admin_token')
        collection = 'admins' if admin_token else 'users'
        if admin_token and admin_token != '123mudar@':
            return json({'alert': ['Invalid admin token']}, 403)
        response = getattr(Config.current, collection).find_one({'_id': data['usercode']})
        if response:
            return json({'alert': ['User already registered']}, 403)
        token = uuid.uuid4().hex
        data['password'] = encrypt_password(data['password'])
        if not admin_token:
            content = generate_content()
            data.update({'content': content})
        getattr(Config.current, collection).insert_one({**data, '_id': data['usercode'],
                                                        'created_at': datetime.utcnow()})
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['usercode']})
        return json({'token': token, 'username': data['username']})
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/login', methods=['POST'])
def login(request: Request) -> json:
    data, errors = Login().load(request.json)
    if not errors:
        response = Config.current.users.find_one({'_id': data['usercode']}) or \
                   Config.current.admins.find_one({'_id': data['usercode']})
        if not response:
            return json({'alert': ['User not registered']}, 403)
        if response['password'] != encrypt_password(data['password']):
            return json({'alert': ['Password does not match']}, 403)
        token = uuid.uuid4().hex
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['usercode']})
        return json({'token': token, 'username': response['username']})
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/logout', methods=['POST'])
def logout(request: Request) -> json:
    token = request.cookies.get('token')
    if Config.current.tokens.find_one({'_id': token}):
        Config.current.tokens.delete_one({'_id': token})
    return json({})


@api.route('/is_admin', methods=['POST'])
def is_admin(request: Request) -> json:
    token = request.cookies.get('token')
    response = Config.current.tokens.find_one({'_id': token})
    if Config.current.admins.find_one({'_id': response['user_id']}):
        return json(True)
    return json(False)


@api.route('/get_years', methods=['POST'])
def get_years(request: Request) -> json:
    data, errors = Usercode().load(request.json)
    if not errors:
        if not data['usercode']:
            token = request.cookies.get('token')
            data['usercode'] = Config.current.tokens.find_one({'_id': token})['user_id']
        user = get_user_info(data['usercode'])
        years = list(map(lambda x: x, user['content']))
        return json(years)
    return json({'alert': parse_errors(errors)}, 403)


# noinspection PyUnusedLocal
@api.route('/get_users', methods=['POST'])
def get_users(request: Request) -> json:
    users = list(map(lambda x: {'label': x['name'], 'value': x['_id']}, list(Config.current.users.find({}))))
    return json(users)


@api.route('/get_subjects', methods=['POST'])
def get_subjects(request: Request) -> json:
    data, errors = Usercode().load(request.json)
    if not errors:
        if not data['usercode']:
            token = request.cookies.get('token')
            data['usercode'] = Config.current.tokens.find_one({'_id': token})['user_id']
        subjects = []
        user = get_user_info(data['usercode'])
        for year in user['content']:
            subjects.extend(list(map(lambda x: list(x.keys())[0], user['content'][year]['scores'])))
        return json(subjects)
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/get_faults', methods=['POST'])
def get_faults(request: Request) -> json:
    data, errors = Usercode().load(request.json)
    if not errors:
        if not data['usercode']:
            token = request.cookies.get('token')
            data['usercode'] = Config.current.tokens.find_one({'_id': token})['user_id']
        user = get_user_info(data['usercode'])
        data = []
        years = list(map(lambda x: x, user['content']))
        for year in years:
            data.append(user['content'][year]['faults'])
        response = {'name': 'Faults', 'labels': years, 'data': data, 'minimum_name': 'Media',
                    'minimum_data': list(map(lambda x: 120, data))}
        return json(response)
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/get_subject_scores', methods=['POST'])
def get_subject_scores(request: Request) -> json:
    data, errors = Usercode().load(request.json)
    if not errors:
        if not data['usercode']:
            token = request.cookies.get('token')
            data['usercode'] = Config.current.tokens.find_one({'_id': token})['user_id']
        user = get_user_info(data['usercode'])
        response = []
        subjects = list(map(lambda x: x['value'], request.json['data']))
        for year, content in user['content'].items():
            for scores in list(filter(lambda x: list(x.keys())[0] in subjects, content['scores'])):
                for subject, score in scores.items():
                    response.append({'name': subject, 'labels': list(map(lambda x: x, score)), 'minimum_name': 'Media',
                                     'data': list(map(lambda x: score[x], score)),
                                     'average_data': get_test_average(subject), 'average_name': 'Class Average',
                                     'minimum_data': list(map(lambda x: 5, score))})
        return json(response)
    return json({'alert': parse_errors(errors)}, 403)


@api.route('/get_year_scores', methods=['POST'])
def get_year_scores(request: Request) -> json:
    data, errors = Usercode().load(request.json)
    if not errors:
        if not data['usercode']:
            token = request.cookies.get('token')
            data['usercode'] = Config.current.tokens.find_one({'_id': token})['user_id']
        user = get_user_info(data['usercode'])
        response = []
        years = list(map(lambda x: x['value'], request.json['data']))
        for year in years:
            subjects, averages = [], []
            for score in user['content'][year]['scores']:
                for subject, average in score.items():
                    subjects.append(subject)
                    averages.append(average['Average'])
            subjects.append('Average')
            averages.append(user['content'][year]['Average'])
            response.append({'name': year, 'labels': subjects, 'data': averages, 'average_name': 'Class Average',
                             'average_data': get_subject_average(year), 'minimum_name': 'Media',
                             'minimum_data': list(map(lambda x: 5, averages))})
        return json(response)
    return json({'alert': parse_errors(errors)}, 403)
