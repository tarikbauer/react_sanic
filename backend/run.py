import os
import time
import hashlib
import uvloop
import subprocess
from api import api
from config import Config
from datetime import datetime
from sanic import Sanic
from sanic.request import Request
from sanic.response import html, json


app = Sanic('lab_project')
app.blueprint(api)
build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'build')
app.static('/build', build_dir, name='build')


# noinspection PyUnusedLocal
def home(request: Request) -> html:
    html_content = open(os.path.join(build_dir, 'index.html'), 'r').read()
    return html(html_content)


@app.middleware('request')
async def before_request(request: Request):
    if not (request.path.startswith('/build') or request.path.startswith('/api')):
        return home(request)
    if request.path.startswith('/api'):
        if request.headers.get('x-apikey', '') != 'd163126c6b834cd0a4ec6417ad00ca1e':
            return json({'apikey': 'Invalid credentials'}, 403)


# noinspection PyUnusedLocal
@app.listener('after_server_start')
async def create_admin(app_instance: Sanic, loop: uvloop.Loop):
    if os.path.exists('/lab_project'):
        os.makedirs('/data/db')
        subprocess.Popen('mongod', shell=True)
        time.sleep(30)
        Config.current.mongodb.insert_one({'_id': 'admin', 'password': hashlib.sha256('123mudar@'.encode()).hexdigest(),
                                           'role': 'root', 'created_at': datetime.utcnow()})


if __name__ == '__main__':
    Config.current = Config()
    app.run('0.0.0.0', 8080)
