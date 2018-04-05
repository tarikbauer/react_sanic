import uuid
from .config import Config
from .helper import authenticate, is_cpf_valid
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
        if not is_cpf_valid(data['cpf']):
            return json({'alert': 'Invalid CPF'}, 403)
        response = Config.current.users.find_one({'_id': data['cpf']})
        if response:
            return json({'alert': 'CPF already registered'}, 403)
        token = uuid.uuid4().hex
        Config.current.users.insert_one({**data, '_id': data['cpf'], 'created_at': datetime.utcnow(), 'role': 'user'})
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['cpf']})
        return json({'token': token, 'redirect': '/home', 'username': data['username']})
    if 'email' in errors:
        return json({'alert': 'Invalid email'}, 403)
    return json(errors, 400)


@api.route('/login', methods=['POST'])
def login(request: Request) -> json:
    data, errors = Login().load(request.json)
    if not errors:
        response = Config.current.users.find_one({'_id': data['cpf']})
        if not response:
            return json({'alert': 'CPF not registered'}, 403)
        if response['password'] != data['password']:
            return json({'alert': 'Password does not match'}, 403)
        token = uuid.uuid4().hex
        Config.current.tokens.insert_one({'_id': token, 'created_at': datetime.utcnow(), 'user_id': data['cpf']})
        return json({'token': token, 'redirect': '/home', 'username': response['username']})
    return json(errors, 400)


@api.route('/logout', methods=['POST'])
def logout(request: Request) -> json:
    token = request.cookies.get('token')
    if Config.current.tokens.find_one({'_id': token}):
        Config.current.tokens.delete_one({'_id': token})
    return json({'redirect': '/'})
