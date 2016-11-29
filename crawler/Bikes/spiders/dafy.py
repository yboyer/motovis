# -*- coding: utf-8 -*-
import scrapy
from Bikes.items import WheelInfo
# import win32api

class BikesSpider(scrapy.Spider):
    name = "dafy"

    def start_requests(self):
        url = 'http://www.dafy-moto.com/pneumatiques/sport.html'
        yield scrapy.Request(url=url, callback=self.parsePages)

    def parsePages(self, res):
        nb = int(res.css('ul.pagination li:nth-last-child(2) a::attr(data-page)').extract_first())
        for i in range(1, nb+1):
            url = "http://www.dafy-moto.com/?view=category-search&p="+str(i)+"&template[0]=108"
            yield scrapy.Request(url=url, callback=self.parsePneumatic)

    def parsePneumatic(self, res):
        pneumaticElements = res.css('div.product-single')

        for el in pneumaticElements:
            img = el.css('img.img-fluid::attr(src)').extract_first()
            imgLogo = el.css('.product-single__brand img::attr(src)').extract_first()
            name = el.css('.product-single__infos__title::text')[0].re(r"Pneu (.*)")[0].strip()
            pneumaticUrl = 'http://www.dafy-moto.com' + el.css('div.product-single a::attr(href)').extract_first()

            wheelInfo = el.css('small::text')[0].re(r"(\d+)/(\d+) [A-Z]*(\d+)")

            wheel = WheelInfo();
            wheel['width'] = wheelInfo[0]
            wheel['height'] = wheelInfo[1]
            wheel['diameter'] = wheelInfo[2]
            wheel['imgUrl'] = img
            wheel['logoUrl'] = imgLogo
            wheel['url'] = pneumaticUrl
            wheel['name'] = name

            yield wheel
