var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  //Task = require('./api/models/paymentExecutionModel'), //created model loading here
  bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes'); //importing route
var healthCheck = require('./healthCheck/healthCheckRoutes'); //importing route
routes(app); //register the route
healthCheck(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
