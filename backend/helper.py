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


def parse_errors(errors: dict) -> list:
    alerts = []
    for alert in errors:
        alerts.extend(list(map(lambda x: x[:-1], errors[alert])))
    return alerts


def get_verifier(factors: list, cpf: list) -> int:
    verifier = 0
    for index, factor in enumerate(factors):
        verifier += cpf[index] * factor
    return 11 - verifier % 11 if verifier % 11 >= 2 else 0


def is_cpf_valid(cpf: str) -> bool:
    first_verifier, second_verifier, cpf = 0, 0, list(map(lambda x: int(x), list(filter(lambda x: x.isalnum(), cpf))))
    if len(cpf) != 11:
        return False
    first_verifier = get_verifier(list(reversed(range(2, 11))), cpf)
    second_verifier = get_verifier(list(reversed(range(2, 12))), cpf)
    if first_verifier != cpf[-2] or second_verifier != cpf[-1]:
        return False
    return True
