var app = new (require('express'))();
var wt = require('webtask-tools');
var MongoClient = require('mongodb').MongoClient;

app.post('*', function (req, res) {
    const task = {
        task: req.webtaskContext.data.task
    }
    getCollection(req.webtaskContext.data.MONGO_URL)
        .then(collection => saveTask(task, collection))
        .then(post       => res.status(200).json(post))
        .catch(err       => res.status(500).end('Error: ' + err.message));
});

function getCollection(url) {
  return new Promise( (resolve, reject) => {
      MongoClient.connect(url, (error, db) => {
        if(error) {
            return reject(error);
        }
        resolve(db.collection('tasks'));
    });
  });
}

function saveTask(doc, collection) {
  return new Promise( (resolve, reject) => {
    collection.insertOne(doc, (error, result) => {
        if (error) {
            return reject(error);
        }
        resolve(result);
      });
  });
}

module.exports = wt.fromExpress(app).auth0();