from .helper import is_cpf_valid
from marshmallow import Schema, fields, ValidationError


def validate_cpf(cpf: str):
    if not is_cpf_valid(cpf):
        raise ValidationError('Invalid CPF.')


class Login(Schema):
    cpf = fields.String(required=True, validate=validate_cpf)
    password = fields.String(required=True)


class Register(Login):
    email = fields.Email(required=True)
    username = fields.String(required=True)
