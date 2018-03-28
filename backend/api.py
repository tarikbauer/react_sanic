import uuid
from config import Config
from schemas import Login, Register
from datetime import datetime
from sanic import Blueprint
from sanic.request import Request
from sanic.response import json


api = Blueprint('api', '/api')


@api.route('/register', methods=['POST'])
def register(request: Request) -> json:
    data, errors = Register().loads(request.json)
    if not errors:
        response = Config.current.mongodb.find_one({'_id': data['cpf']})
        if response:
            return json({data['cpf']: 'CPF already registered'}, 400)
        token = uuid.uuid4().hex
        body = {**data, '_id': data['cpf'], 'tokens': {'token': token, 'token_set_at': datetime.utcnow()},
                'created_at': datetime.utcnow(), 'role': 'user'}
        Config.current.mongodb.insert_one(body)
        return json({'token': token})
    return json(error, 400)


@api.route('/login', methods=['POST'])
def login(request: Request) -> json:
    data, errors = Login().loads(request.json)
    if not errors:
        response = Config.current.mongodb.find_one({'_id': data['cpf']})
        if not response:
            return json({data['cpf']: 'CPF not registered'}, 400)
        if response['password'] != data['password']:
            return json({'password': 'Password does not match'}, 400)
        token = uuid.uuid4().hex
        Config.current.mongodb.update_one({'_id': data['cpf']},
                                          {'$push': {'tokens': {'token': token, 'token_set_at': datetime.utcnow()}}})
        return json({'token': token})
    return json(error, 400)
