const bodyParser = require('body-parser'),
  express = require('express')
  app = express(),
  PORT = process.env.PORT || 8080,
  kafka = require('kafka-node'),
  Producer = kafka.Producer,
  APP_VERSION = "0.8.5",
  APP_NAME = "PaymentStateCommand",
  KAFKA_BROKER_IP = 'payment-kafka-headless:9092';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./routes'); //importing route

function initializeKafkaProducer(attempt) {
  try {
    console.log(`Try to initialize Kafka Client at ${KAFKA_BROKER_IP} and Producer, attempt ${attempt}`);
    const client = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER_IP });
    console.log("created client");
    producer = new Producer(client);
    console.log("submitted async producer creation request");
    producer.on('ready', function () {
      console.log("Producer is ready in " + APP_NAME);
      var controller = require('./controller').init(producer);
      routes(app, controller);
      app.listen(PORT);
      console.log('RESTful API server started on: ' + PORT);
    });
    producer.on('error', function (err) {
      console.log("failed to create the client or the producer " + JSON.stringify(err));
    })
  } catch (e) {
    console.log("Exception in initializeKafkaProducer" + JSON.stringify(e));
    console.log("Try again in 5 seconds");
    setTimeout(initializeKafkaProducer, 5000, ++attempt);
  }
}

initializeKafkaProducer(1);
