# -*- coding: utf-8 -*-

import pymongo
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
            settings.get("DB"),
            settings.get("COLLECTION")
        )

    def __init__(self, server, port, db, collection):
        connection = pymongo.MongoClient(
            server or settings['MONGODB_SERVER'],
            int(port or settings['MONGODB_PORT'])
        )
        db = connection[db or settings['MONGODB_DB']]
        self.collection = db[collection or settings['MONGODB_COLLECTION']]

    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                raise DropItem("Missing {0}!".format(data))
        if valid:
            self.collection.insert(dict(item))
            log.msg("added to MongoDB database!",
                    level=log.DEBUG, spider=spider)
        return item
