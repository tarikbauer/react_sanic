import os
import ujson
from backend.api import api
from backend.config import Config
from backend.helper import authenticate
from backend.worker import TokenCleaner
from sanic import Sanic
from sanic.request import Request
from sanic.response import html, redirect


app = Sanic('react_sanic')
app.blueprint(api)
build_dir = os.path.join(os.path.dirname(__file__), 'frontend', 'build')
app.static('/build', build_dir, name='build')


# noinspection PyUnusedLocal
def home(request: Request) -> html:
    html_content = open(os.path.join(build_dir, 'index.html'), 'r').read()
    return html(html_content)


@app.middleware('request')
async def before_request(request: Request):
    if request.path.startswith('/build') or request.path in ['/api/login', '/api/register', '/api/is_authenticated']:
        pass
    elif request.path in ['/', '/login', '/register']:
        token, user_id = authenticate(request)
        if user_id and request.path == '/login':
            return redirect('/home')
        return home(request)
    else:
        token, user_id = authenticate(request)
        if not user_id:
            return redirect('/login')
        elif not request.path.startswith('/api'):
            return home(request)


if __name__ == '__main__':
    with open(os.path.join(os.path.dirname(__file__), 'backend', 'debug.json'), 'r') as config:
        loaded_config = ujson.load(config)
    Config.current = Config(loaded_config)
    TokenCleaner().start()
    app.run(loaded_config['host'], loaded_config['port'], loaded_config['debug'], workers=loaded_config['workers'])
