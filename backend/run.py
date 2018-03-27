import os
from backend.api import api
from backend.config import Config
from sanic import Sanic
from sanic.request import Request
from sanic.response import html


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


if __name__ == '__main__':
    Config.current = Config()
    app.run('0.0.0.0', 8080, True)
