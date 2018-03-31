from .config import Config
from datetime import datetime
from sanic.request import Request


def authenticate(request: Request) -> tuple:
    token = request.cookies.get('token', '')
    response = Config.current.tokens.find_one({'_id': token})
    if not response:
        return token, ''
    elif (datetime.utcnow() - response['created_at']).days > 0:
        return token, ''
    return token, response['user_id']
