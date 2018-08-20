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

MongoClient.connect("mongodb://payment-mongodb:27017/payments", null, function(err, mongoclient) {
  if(err)
    throw err;

  var database = mongoclient.db("payments");
  console.log(database);
  routes(app, database); //register the route
  healthCheck(app);
  app.listen(port);
});

console.log('todo list RESTful API server started on: ' + port);
