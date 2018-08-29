const kafka = require('kafka-node'),
  KeyedMessage = kafka.KeyedMessage,
  TOPIC_NAME = "payment-state",
  uuid = require('uuid/v4');

var producer;

exports.init = function(kafkaProducer) {
  producer = kafkaProducer;
  return this;
};

exports.insertPaymentState = function(req, res) {
  var payment = req.body;
  payment.id = uuid();

  var event = {"type": "CREATED", "payment": payment};
  var eventStr = JSON.stringify(event);

  console.log("event: " + eventStr);

  km = new KeyedMessage(payment.id, eventStr);
  payloads = [
    { topic: TOPIC_NAME, messages: [km] }
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.error("Failed to publish event with key " + payment.id + " to topic " + TOPIC_NAME + " :" + JSON.stringify(err));
      res.status(500).json(err);
    } else {
      console.log("Published event with key " + payment.id + " to topic " + TOPIC_NAME + " :" + JSON.stringify(data));
      res.status(201).json(payment);
    }
  });
};

exports.updatePaymentState = function(req, res) {
  var payment = req.body;
  payment.id = req.params.paymentId;
  var event = {"type": "UPDATED", "payment": payment};
  var eventStr = JSON.stringify(event);

  console.log("event: " + eventStr);

  km = new KeyedMessage(payment.id, eventStr);
  payloads = [
    { topic: TOPIC_NAME, messages: [km] }
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.error("Failed to publish event with key " + payment.id + " to topic " + TOPIC_NAME + " :" + JSON.stringify(err));
      res.status(500).json(err);
    } else {
      console.log("Published event with key " + payment.id + " to topic " + TOPIC_NAME + " :" + JSON.stringify(data));
      res.status(204).end();
    }
  });
};
