# -*- coding: utf-8 -*-
import scrapy
import win32api

class BikesSpider(scrapy.Spider):
    name = "motoblouz"

    def start_requests(self):
        url = 'http://www.motoplanete.com/constructeurs/constructeursIndex/index.php'
        # yield scrapy.Request(url=url, callback=self.parse)
