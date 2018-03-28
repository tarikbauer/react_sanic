from marshmallow import Schema, fields


class Login(Schema):
    cpf = fields.String(required=True)
    password = fields.String(required=True)


class Register(Login):
    email = fields.Email(required=True)
