# motovis
> Motorbikes data visualiser

## Prerequisites:
  - `MongoDB`
  - `Scrapy`
    - `pymongo`
  - `Node.js`

## Usage:
### Install
##### Clone the GitHub repo:
```bash
git clone https://github.com/yboyer/motovis.git
cd motovis
```
##### Install dependencies:
```bash
npm i
```
### Fill the MongoDB database
##### Crawl data with Scrapy:
```bash
cd crawler
scrapy crawl bikes
# scrapy crawl bikes -s SERVER=localhost -s PORT=27017 -s DB=bikecrawlers -s COLLECTION=Bikes
```
### Run
##### Run server and start listening on port `3000`
```bash
npm start
```
