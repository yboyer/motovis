# -*- coding: utf-8 -*-
import scrapy
from Bikes.items import AccessoriesInfo
# import win32api

class BikesSpider(scrapy.Spider):
    name = "motoblouz"

    def start_requests(self):
        url = 'http://www.motoblouz.com/pieces-detachees-equipement-moto-bagagerie-souple-5879.html'
        yield scrapy.Request(url=url, callback=self.parseItems)

    def parseItems(self, res):
        accessories = res.css('div.list_block')

        for el in accessories:
            accessoryUrl = el.css('div.title h3 a::attr(href)').extract_first()
            if accessoryUrl:
                accessoryUrl = 'http://www.motoblouz.com' + accessoryUrl
                img = el.css('img.product::attr(src)').extract_first()
                name = el.css('div.title h3 a::attr(title)').extract_first()
                price = el.css('span.price::text').re(r"(\d+\,?\d+)")[0]
                stars = el.css('div.stars').extract_first()
                stars = len(el.css('i.sprites-star_on'))
                if len(el.css('i.sprites-star_half')):
                    stars += 0.5
                print stars
                accessory = AccessoriesInfo();
                accessory['imgUrl'] = img
                accessory['url'] = accessoryUrl
                accessory['price'] = price
                accessory['stars'] = stars
                accessory['name'] = name

                yield accessory
                # url = el.css('a::attr(href)').extract_first()
                # yield scrapy.Request(url=url, callback=self.parse)
