const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/bikecrawler", (err, db) => {
  if (err) {
    return console.dir(err);
  }

  const bikesCollection = db.collection('Bikes');
  bikesCollection.find().toArray(function(err, items) {
    console.log(items.length + ' docs stored');

    db.close();
  });
});
