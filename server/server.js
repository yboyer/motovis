//@flow

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const crypto = require('crypto');
const tools = require('./tools');

const PORT = 3000;

let accessories = [];
let bikes = [];

app.use(express.static(path.join(__dirname, '../client')));


// Accessoires
app.get('/accessories.json', (req, res) => {
  res.json(accessories);
});

// L'arborescence
app.get('/data.json', (req, res) => {
  // Récupération du paramètre GET `sort` [date | brand]
  const key1 = req.query.sort;
  const treeTag = key1 === 'date' ? 'années' : 'marques';
  const key2 = key1 === 'date' ? 'brand' : 'date';


  tools.clear();

  bikes.forEach(bike => {
    const key = treeTag + `.${bike[key1]}.${bike[key2]}.${bike.name}`;
    tools.insertTo(key, bike);
  });

  tools.sort();

  res.json(tools.data);
});


// Connexion à la base de données
MongoClient.connect("mongodb://localhost:27017/bikecrawler", (err, db) => {
  if (err) {
    return console.error(err);
  }

  console.log(' //Preloading...');
  console.time('Preload');

  const wheels = {};

  // Récupération des accessories
  db.collection('Accessories').find().toArray()
    .then((items) => {
      accessories = items;
    })
    .catch(err => {
      console.error(err);
    });

  // Récupération des pneumatiques
  db.collection('Wheels').find().toArray()
    .then((items) => {
      // Réorganisation des données
      items.forEach((wheel) => {
        const key = `${wheel.diameter}${wheel.height}${wheel.width}`;

        if (!wheels[key]) {
          wheels[key] = [];
        }

        wheels[key].push(wheel);
      });

      // Récupération des motos
      return db.collection('Bikes').find({
        date: {
          $gte: '1990'
        }
      }).toArray();
    })
    .then((items) => {
      bikes = items;

      bikes.forEach((bike) => {
        bike.name = bike.name.replace(/\./g, '_');

        // Ajout des pneumatiques aux motos
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

      console.timeEnd('Preload');
      console.log(' //Preloaded.');

      return Promise.resolve();
    })
    .then(() => {
      // Lancement du serveur
      app.listen(PORT, () => {
        console.log(`\nListening on :${PORT}`);
      });
    })
    .catch(err => {
      // Récupération des érreurs
      console.error(err);
    });
});
