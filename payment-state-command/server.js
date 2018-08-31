const bodyParser = require('body-parser'),
  express = require('express')
  app = express(),
  PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var controller = require('./controller').init();
var routes = require('./routes'); //importing route
routes(app, controller);
app.listen(PORT);
console.log('RESTful API server started on: ' + PORT);
