import os
import ujson
from backend.api import api
from backend.config import Config
from datetime import datetime
from sanic import Sanic
from sanic.request import Request
from sanic.response import html, json


app = Sanic('react_sanic')
app.blueprint(api)
build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'build')
app.static('/build', build_dir, name='build')


# noinspection PyUnusedLocal
def home(request: Request) -> html:
    html_content = open(os.path.join(build_dir, 'index.html'), 'r').read()
    return html(html_content)


@app.middleware('request')
async def before_request(request: Request):
    if request.path.startswith('/build') or request.path in ['/api/login', '/api/register']:
        pass
    elif request.path in ['/', '/login', '/register']:
        return home(request)
    else:
        token = request.cookies.get('token', '')
        response = Config.current.tokens.find_one({'_id': token})
        if not response:
            return json({'alert': 'Invalid credentials', 'redirect': '/login'}, 403)
        elif (datetime.utcnow() - response['created_at']).days > 0:
            return json({'alert': 'Invalid credentials', 'redirect': '/login'}, 403)
        elif not request.path.startswith('/api'):
            return home(request)


if __name__ == '__main__':
    with open(os.path.join(os.path.dirname(__file__), 'debug.json'), 'r') as config:
        loaded_config = ujson.load(config)
    Config.current = Config(loaded_config)
    app.run(loaded_config['host'], loaded_config['port'], loaded_config['debug'], workers=loaded_config['workers'])
