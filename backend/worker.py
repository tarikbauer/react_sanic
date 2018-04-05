import time
from .config import Config
from datetime import datetime, timedelta
from threading import Thread


class TokenCleaner(Thread):

    def __init__(self, time_sleep: int=60):
        super().__init__()
        self.time_sleep = time_sleep

    def run(self):
        while True:
            Config.current.tokens.delete_many({'created_at': {'$lt': datetime.utcnow() - timedelta(days=1)}})
            time.sleep(self.time_sleep)
