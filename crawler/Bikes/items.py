# -*- coding: utf-8 -*-

import scrapy


class WeelInfo():
    width = scrapy.Field()
    height = scrapy.Field()
    diameter = scrapy.Field()

class BikeInfo(scrapy.Item):
    imgUrl = scrapy.Field()
    gears = scrapy.Field()
    transmission = scrapy.Field()
    cc = scrapy.Field()
    power = scrapy.Field()
    torque = scrapy.Field()
    capacity = scrapy.Field()
    weight = scrapy.Field()
    frontWeel = scrapy.Field(serializer=WeelInfo)
    backWeel = scrapy.Field(serializer=WeelInfo)

class BikeItem(scrapy.Item):
    name = scrapy.Field()
    date = scrapy.Field()
    price = scrapy.Field()
    link = scrapy.Field()
    model = scrapy.Field()
    imgUrl = scrapy.Field()
    brand = scrapy.Field()
    info = scrapy.Field(serializer=BikeInfo)
