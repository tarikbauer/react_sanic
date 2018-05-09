from .helper import is_cpf_valid
from marshmallow import Schema, fields, ValidationError


def validate_cpf(cpf: str):
    if not is_cpf_valid(cpf):
        raise ValidationError('Invalid CPF.')


class Login(Schema):
    usercode = fields.String(required=True)
    password = fields.String(required=True)


class Register(Login):
    name = fields.String(required=True)
    military_name = fields.String(required=True)
    email = fields.Email(required=True)
    cpf = fields.String(required=True, validate=validate_cpf)
