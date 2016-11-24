# -*- coding: utf-8 -*-

import scrapy
from Bikes.items import BikeItem
# import win32api

## PAGE TREE ##
# Contructors ->
#   Dates ->
#       Models ->
#           Model characteristics
###############

class BikesSpider(scrapy.Spider):
    name = "motoplanete"

    def start_requests(self):
        url = 'http://www.motoplanete.com/constructeurs/constructeursIndex/index.php'
        yield scrapy.Request(url=url, callback=self.parseContructor)

    def parseContructor(self, res):
        contructorsElement = res.css('div#listeMoto li')
        for el in contructorsElement:
            url = el.css('a::attr(href)').extract_first()
            yield scrapy.Request(url=url, callback=self.parseDates)

    def parseDates(self, res):
        datesElement = res.css('a.logoMP')
        for el in datesElement:
            url = el.css('::attr(href)').extract_first()
            date = el.css('::text').extract_first()

            req = scrapy.Request(res.urljoin(url), callback=self.parseModels)
            req.meta['date'] = date
            yield req

    def parseModels(self, res):
        bikesElement = res.css('li.constr_moto')

        for el in bikesElement:
            bike = BikeItem(
                date= res.meta['date'],
                name= el.css('span[itemprop="name"]::text').extract_first(),
                brand= el.css('meta[itemprop="brand"]::attr(content)').extract_first(),
                price= el.css('meta[itemprop="price"]::attr(content)').extract_first(),
                model= el.css('meta[itemprop="model"]::attr(content)').extract_first(),
                imgUrl= el.css('img[itemprop="image"]::attr(src)').extract_first(),
                link= el.css('a[itemprop="url"]::attr(href)').extract_first()
            )

            url = bike['link']
            if 'essai.html' not in url:
                req = scrapy.Request(res.urljoin(url), callback=self.parseModel)
                req.meta['bike'] = bike
                yield req

    def parseModel(self, res):
        bike = res.meta['bike']
        bike['info'] = {}

        bike['info']['imgUrl'] = res.css('div#imageTech img::attr(src)').extract_first()
        bike['info']['gears'] = res.css('ul.transmission li::text')[1].re(r"(\d)")[0]
        bike['info']['transmission'] = res.css('ul.transmission li::text')[2].re(r"par (\w+)")[0]

        assiseData = res.css('ul.assise li::text');
        bike['info']['capacity'] = assiseData[2].re(r"(\d+)")[0]
        for li in assiseData:
            data = li.re(r"(\d+) kg$")
            if data:
                bike['info']['weight'] = data[0]

        # MOTOR
        bike['info']['cc'] = res.css('ul.moteur li::text')[6].re(r"(\d+\.?\d+) cc")[0]
        powerRes = res.css('ul.moteur li')[7].css('a::text').re(r"(\d+) ch")
        if len(powerRes) == 1:
            bike['info']['power'] = powerRes[0]
        torqueRes = res.css('ul.moteur li')[8].css('a::text').re(r"(\d+\.?\d+) mkg")
        if len(torqueRes) == 1:
            bike['info']['power'] = torqueRes[0]

        # WHEELS
        frontWheel = res.css('ul.trainavant a::text').re(r"(\d+) / (\d+) - (\d+)")
        if len(frontWheel) == 3:
            bike['info']['frontWheel'] = {
                'width': frontWheel[0],
                'height': frontWheel[1],
                'diameter': frontWheel[2]
            }
        backWheel = res.css('ul.trainarriere a::text').re(r"(\d+) / (\d+) - (\d+)")
        if len(frontWheel) == 3:
            bike['info']['backWheel'] = {
                'width': frontWheel[0],
                'height': frontWheel[1],
                'diameter': frontWheel[2]
            }

        return bike
