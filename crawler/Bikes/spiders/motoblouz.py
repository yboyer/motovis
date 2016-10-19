# -*- coding: utf-8 -*-
import scrapy
from Bikes.items import WheelInfo
import win32api

class BikesSpider(scrapy.Spider):
    name = "motoblouz"

    def start_requests(self):
        url = 'http://www.dafy-moto.com/pneumatiques/sport.html'
        yield scrapy.Request(url=url, callback=self.parsePages)

    def parsePages(self, res):
        nb = int(res.css('ul.pagination li:nth-last-child(1) a::attr(href)').re(r"p=(\d+)")[0])
        for i in range(1, nb+1):
            url = "http://www.dafy-moto.com/?view=category-search&p="+str(i)+"&template[0]=108"
            yield scrapy.Request(url=url, callback=self.parsePneumatic)
    def parsePneumatic(self, res):
        pneumaticElements = res.css('div.product-single')

        for el in pneumaticElements:
            img = el.css('img.img-fluid::attr(src)').extract_first()
            pneumaticUrl = el.css('div.product-single a::attr(href)').extract_first()
            pneumaticUrl = 'http://www.dafy-moto.com' + pneumaticUrl
            wheel = WheelInfo();
            rawInfo = el.css('small::text')[0].re(r"(\d+)/(\d+) [A-Z]*(\d+)")
            wheel['width'] = rawInfo[0]
            wheel['height'] = rawInfo[1]
            wheel['diameter'] = rawInfo[2]
            wheel['imgUrl'] = img
            wheel['url'] = pneumaticUrl
            yield wheel
            # url = el.css('a::attr(href)').extract_first()
            # yield scrapy.Request(url=url, callback=self.parse)
