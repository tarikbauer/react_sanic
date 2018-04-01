FROM ubuntu:17.10

ENV PIP /venv/bin/pip
ENV PYTHON /venv/bin/python
ENV ROOT_DIR /react_sanic

RUN apt update
RUN apt install -y apt-utils software-properties-common build-essential openssl libffi-dev libssl-dev git vim unzip curl
RUN apt install -y python3.6 python3.6-dev virtualenv
RUN virtualenv -p /usr/bin/python3.6 /venv
RUN curl https://deb.nodesource.com/setup_9.x | bash
RUN apt update
RUN apt install -y nodejs
RUN npm install -g npm

ADD . ${ROOT_DIR}

RUN ${PIP} install -r ${ROOT_DIR}/backend/requirements.txt
RUN cd ${ROOT_DIR}/frontend && npm install

EXPOSE 8079

CMD ${PYTHON} ${ROOT_DIR}/backend/run.py
