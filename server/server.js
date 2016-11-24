//@flow

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const crypto = require('crypto');
const tools = require('./tools');

const PORT = 3000;

let accessories = [];

app.use(express.static(path.join(__dirname, '../client')));


app.get('/data.json', (req, res) => {
  res.json(tools.data);
});

app.get('/accessories.json', (req, res) => {
  res.json(accessories);
});


MongoClient.connect("mongodb://localhost:27017/bikecrawler", (err, db) => {
  if (err) {
    return console.error(err);
  }

  console.log('//Preloading...');

  const wheels = {};

  db.collection('Accessories').find().toArray()
    .then((items) => {
      accessories = items;
    })
    .catch(err => {
      console.error(err);
    });

  db.collection('Wheels').find().toArray()
    .then((items) => {

      items.forEach((wheel) => {
        const key = `${wheel.diameter}${wheel.height}${wheel.width}`;

        if (!wheels[key]) {
          wheels[key] = [];
        }

        wheels[key].push(wheel);
      });


      return db.collection('Bikes').find({
        date: {
          $gte: '1990'
        }
      }).toArray();
    })
    .then((items) => {

      items.forEach(bike => {
        const bikeKey = `années.${bike.date}.${bike.brand}.${bike.name.replace(/\./g, '_')}`;
        tools.insertTo(bikeKey, bike);


        const frontWheel = bike.info.frontWheel;
        if (frontWheel) {
          const key = `${frontWheel.diameter}${frontWheel.height}${frontWheel.width}`;
          if (wheels[key]) {
            frontWheel.data = wheels[key];
          }
        }

        const backWheel = bike.info.backWheel;
        if (backWheel) {
          const key = `${backWheel.diameter}${backWheel.height}${backWheel.width}`;
          if (wheels[key]) {
            backWheel.data = wheels[key];
          }
        }
      });

      tools.sort();

      console.log('//done.');
    })
    .catch(err => {
      console.error(err);
    });


  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});
