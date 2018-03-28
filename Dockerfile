FROM ubuntu:17.10

ENV PIP /venv/bin/pip
ENV PYTHON /venv/bin/python
ENV ROOT_DIR /lab_project

RUN apt update
RUN apt install -y apt-utils software-properties-common build-essential openssl libffi-dev libssl-dev git vim unzip curl
RUN apt install -y python3.6 python3.6-dev virtualenv
RUN virtualenv -p /usr/bin/python3.6 /venv
RUN curl https://deb.nodesource.com/setup_9.x | bash
RUN apt update
RUN apt install -y nodejs
RUN npm install -g npm
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
RUN apt update
RUN apt install -y mongodb-org

ADD . ${ROOT_DIR}

RUN ${PIP} install -r ${ROOT_DIR}/backend/requirements.txt
RUN cd ${ROOT_DIR}/frontend && npm install

EXPOSE 8080

CMD ${PYTHON} ${ROOT_DIR}/backend/run.py
