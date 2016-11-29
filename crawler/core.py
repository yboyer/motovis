from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

process = CrawlerProcess(get_project_settings())
process.crawl('motoplanete')
process.crawl('dafy')
process.crawl('motoblouz')
process.start()
