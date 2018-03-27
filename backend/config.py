from pymongo import MongoClient


class Config:
    current = None

    def __init__(self):
        client = MongoClient(connect=False)
        self.mongodb = client.get_database('lab_project').get_collection('users')
