from pymongo import MongoClient


class Config:
    current = None

    def __init__(self, config: dict):
        client = MongoClient(host=config['mongodb']['host'], port=config['mongodb']['port'],
                             connect=False).get_database(config['mongodb']['database'])
        self.users = client.get_collection('users')
        self.tokens = client.get_collection('tokens')
