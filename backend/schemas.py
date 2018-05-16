from .helper import is_cpf_valid
from marshmallow import Schema, fields, ValidationError


def validate_cpf(cpf: str):
    if not is_cpf_valid(cpf):
        raise ValidationError('Invalid CPF.')


class Usercode(Schema):
    usercode = fields.String(missing='')
    data = fields.List(fields.Field(), missing=[])


class Login(Usercode):
    usercode = fields.String(required=True)
    password = fields.String(required=True)


class Register(Login):
    name = fields.String(required=True)
    situation = fields.String(required=True)
    username = fields.String(required=True)
    email = fields.Email(required=True)
    cpf = fields.String(required=True, validate=validate_cpf)
    admin_token = fields.String(missing='')
