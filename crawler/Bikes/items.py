# -*- coding: utf-8 -*-

import scrapy

class AccessoriesInfo(scrapy.Item):
    price = scrapy.Field()
    stars = scrapy.Field()
    url = scrapy.Field()
    imgUrl = scrapy.Field()
    name = scrapy.Field()


class WheelInfo(scrapy.Item):
    width = scrapy.Field()
    height = scrapy.Field()
    diameter = scrapy.Field()
    imgUrl = scrapy.Field()
    url = scrapy.Field()

class BikeInfo(scrapy.Item):
    imgUrl = scrapy.Field()
    gears = scrapy.Field()
    transmission = scrapy.Field()
    cc = scrapy.Field()
    power = scrapy.Field()
    torque = scrapy.Field()
    capacity = scrapy.Field()
    weight = scrapy.Field()
    frontWheel = scrapy.Field(serializer=WheelInfo)
    backWheel = scrapy.Field(serializer=WheelInfo)

class BikeItem(scrapy.Item):
    name = scrapy.Field()
    date = scrapy.Field()
    price = scrapy.Field()
    link = scrapy.Field()
    model = scrapy.Field()
    imgUrl = scrapy.Field()
    brand = scrapy.Field()
    info = scrapy.Field(serializer=BikeInfo)
