import hashlib
from .config import Config
from datetime import datetime
from sanic.request import Request


def encrypt_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_user_info(usercode: str) -> dict:
    return Config.current.users.find_one({'_id': usercode})


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


def get_subject_average(year: str) -> list:
    response = []
    users = list(Config.current.users.find({}))
    for user in users:
        user_average = []
        for score in user['content'][year]['scores']:
            for subject, average in score.items():
                user_average.append(average['Average'])
        user_average.append(user['content'][year]['Average'])
        if not response:
            response = user_average.copy()
        else:
            response = [x + y for x, y in zip(response, user_average)]
    response = list(map(lambda x: round(x/len(users), 2), response))
    return response
