# -*- coding: utf-8 -*-

from pymongo import MongoClient
from scrapy.conf import settings
from scrapy.exceptions import DropItem
from scrapy import log


class MongoDBPipeline(object):
    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        return cls(
            settings.get("SERVER"),
            settings.get("PORT"),
            settings.get("DB")
        )

    def __init__(self, server, port, db):
        connection = MongoClient(
            server or settings['MONGODB_SERVER'],
            int(port or settings['MONGODB_PORT'])
        )
        self.db = connection[db or settings['MONGODB_DB']]

    def process_item(self, item, spider):
        collection = self.db[settings['MONGODB_COLLECTION'][type(item).__name__]]
        collection.insert(dict(item))
        log.msg("added to MongoDB database!", level=log.DEBUG, spider=spider)
        return item
