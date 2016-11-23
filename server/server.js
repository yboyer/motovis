//@flow

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const crypto = require('crypto');
const data = [];

const PORT = 3000;
let db = null;


app.use(express.static(path.join(__dirname, '../client')));



MongoClient.connect("mongodb://localhost:27017/bikecrawler", (err, db) => {
  if (err) {
    return console.dir(err);
  }

  const bikesCollection = db.collection('Bikes');

  bikesCollection.find({brand: 'Yamaha'}).toArray().then((items) => {
    const years = [];
    const bikes = {};

    items.forEach(item => {
      // const bikeKey = new Buffer(item.name).toString('base64');
      const bikeKey = crypto.createHash('md5').update(item.name).digest("hex");

      if (years[item.date] === undefined) {
        years[item.date] = [];
      }
      if (bikes[bikeKey] === undefined) {
        bikes[bikeKey] = [];
      }

      years[item.date].push(`bikes.bike.${bikeKey}`);
      bikes[bikeKey].push(item);

    });


    years.forEach((value, key) => {
      data.push({
        name: `bikes.year.${key}`,
        label: key,
        imports: value
      });
    });

    Object.keys(bikes).forEach((key) => {
      data.push({
        name: `bikes.bike.${key}`,
        data: bikes[key],
        label: bikes[key][0].name,
        imports: []
      });
    });

    console.log(data.length);


  }).catch(err => {
    console.error(err);
  });



  app.get('/data.json', (req, res) => {
    res.json(data);
  });


  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});
