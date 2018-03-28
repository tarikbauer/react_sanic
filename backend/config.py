from pymongo import MongoClient


class Config:
    current = None

    def __init__(self):
        client = MongoClient(connect=False)
        self.mongodb = client.get_database('react_sanic').get_collection('users')
