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
#### From the dump
##### Restore data With `mongorestore`:
```
mongorestore
```
#### With Scrapy
##### Crawl data of websites:
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
