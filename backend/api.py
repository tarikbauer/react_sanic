from sanic import Blueprint
from sanic.request import Request
from sanic.response import json


api = Blueprint('api', '/api')


# noinspection PyUnusedLocal
@api.route('/login', methods=['POST'])
def login(request: Request) -> json:
    print(request.json)
    return json({'valid': True})
