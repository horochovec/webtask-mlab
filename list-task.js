var app = new (require('express'))();
var wt = require('webtask-tools');
var MongoClient = require('mongodb').MongoClient;

app.get('/', function(req, res) {
    getCollection(req.webtaskContext.data.MONGO_URL)
        .then(data => getData(data))
        .then(post => res.status(200).json(post))
        .catch(err => res.status(500).end("Error: " + err.message));
});

function getCollection(url) {
  return new Promise( (resolve, reject) => {
      MongoClient.connect(url, (err, db) => {
        if(err) {
            return reject(err);
        }
        resolve(db.collection('tasks'));
    });
  });
}

function getData(collection) {
  return new Promise( (resolve, reject) => {
    collection.find().toArray(function(error, items) {
        if (error) return reject(error);
        resolve(items);
      });
  });  
}

module.exports = wt.fromExpress(app).auth0();