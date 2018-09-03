const bodyParser = require('body-parser'),
  express = require('express'),
  MongoClient = require('mongodb').MongoClient,
  app = express(),
  PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes'); //importing route

var options = {
  useMongoClient: true,
  uri_decode_auth: true,
  auth: {authdb: 'admin'},
  user: 'root',
  password: 'IQaGuNc0vD',
}
var url = "mongodb://payment-mongodb:27017/payment-mongodb";

MongoClient.connect(url, options, function(err, client) {
  if(err) throw err;
  var db = client.db('payment-mongodb');
  var controller = require('./controller').init(db);
  var handler = require('./handler').init(db);
  routes(app, controller); //register the route
  app.listen(PORT);
});

console.log('RESTful API server started on: ' + PORT);
