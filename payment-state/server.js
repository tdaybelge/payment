var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  //Task = require('./api/models/paymentExecutionModel'), //created model loading here
  bodyParser = require('body-parser'),
  MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes'); //importing route
var healthCheck = require('./healthCheck/healthCheckRoutes'); //importing route


var options = {
  useMongoClinet: true,
  uri_decode_auth: true,
  auth: {authdb: 'admin'},
  user: 'root',
  password: 'kGywRdh4VL',
}
var url = "mongodb://payment-mongodb:27017/payment-mongodb";

MongoClient.connect(url, options, function(err, db) {
  if(err) throw err;
  var controller = require('./controller').init(db);
  routes(app, controller); //register the route
  healthCheck(app);
  app.listen(port);
});

console.log('todo list RESTful API server started on: ' + port);
