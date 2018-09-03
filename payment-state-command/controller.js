const kafka = require('kafka-node'),
  TOPIC_NAME = "payment-state",
  Producer = kafka.Producer,
  APP_VERSION = "0.8.5",
  APP_NAME = "PaymentStateCommand",
  KAFKA_BROKER_IP = 'payment-kafka-headless:9092',
  ObjectID = require('mongodb').ObjectID;

var producer;

const hashCode = function(stringOrBuffer) {
  let hash = 0;
  if (stringOrBuffer) {
    const string = stringOrBuffer.toString();
    const length = string.length;

    for (let i = 0; i < length; i++) {
      hash = (hash * 31 + string.charCodeAt(i)) & 0x7fffffff;
    }
  }

  return hash === 0 ? 1 : hash;
};

function initializeKafkaProducer(attempt) {
  try {
    console.log(`Try to initialize Kafka Client at ${KAFKA_BROKER_IP} and Producer, attempt ${attempt}`);
    const client = new kafka.KafkaClient({ kafkaHost: KAFKA_BROKER_IP });
    console.log("created client");
    const options = {
      // Configuration for when to consider a message as acknowledged, default 1
      requireAcks: 1,
      // The amount of time in milliseconds to wait for all acks before considered, default 100ms
      ackTimeoutMs: 100,
      // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 4
    }
    var partitioner = function (partitions, key) {
      key = key || '0';
      var index = hashCode(key) % partitions.length;
      console.log(`number of partitions: ${partitions.length}, key: ${key}, index: ${index}`);
      return partitions[index];
    };

    producer = new Producer(client, options, partitioner);
    console.log("submitted async producer creation request");
    producer.on('ready', function () {
      console.log("Producer is ready in " + APP_NAME);
      client.refreshMetadata([TOPIC_NAME], (err) => {
          if (err) {
              console.warn('Error refreshing kafka metadata', err);
          }
      });
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

exports.init = function() {
  initializeKafkaProducer(1);
  return this;
};

exports.insertPaymentState = function(req, res) {
  var payment = req.body;
  var key = payment.id = new ObjectID();

  var event = {"type": "CREATED", "payment": payment};
  var eventStr = JSON.stringify(event);

  console.log("event: " + eventStr);

  var payloads = [
    { "topic": TOPIC_NAME, "messages": [eventStr], "key": key }
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.error(`Failed to publish event with key ${key} to topic ${TOPIC_NAME}: ${JSON.stringify(err)}`);
      res.status(500).json(err);
    } else {
      console.log(`Published event with key ${key} to topic ${TOPIC_NAME}: ${JSON.stringify(data)}`);
      data.key = key;
      res.status(202).json(data);
    }
  });
};

exports.updatePaymentState = function(req, res) {
  var payment = req.body;
  var key = payment.id = req.params.paymentId;
  var event = {"type": "UPDATED", "payment": payment};
  var eventStr = JSON.stringify(event);

  console.log("event: " + eventStr);

  var payloads = [
    { "topic": TOPIC_NAME, "messages": [eventStr], "key": key }
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.error(`Failed to publish event with key ${key} to topic ${TOPIC_NAME}: ${JSON.stringify(err)}`);
      res.status(500).json(err);
    } else {
      console.log(`Published event with key ${key} to topic ${TOPIC_NAME}: ${JSON.stringify(data)}`);
      data.key = key;
      res.status(202).json(data);
    }
  });
};
