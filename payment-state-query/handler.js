var kafka = require('kafka-node');
var ObjectID = require('mongodb').ObjectID;

var client;

var APP_VERSION = "0.8.5"
var APP_NAME = "payment-state-query"

var eventListenerAPI = module.exports;

var kafka = require('kafka-node')
var Consumer = kafka.Consumer

// from the Oracle Event Hub - Platform Cluster Connect Descriptor

var TOPIC_NAME = "payment-state";

var db;

exports.init = function(database) {
  db = database;
  return this;
};

console.log("Running Module " + APP_NAME + " version " + APP_VERSION);
console.log("Event Hub Topic " + TOPIC_NAME);

var KAFKA_BROKER_IP = 'payment-kafka-headless:9092';

var consumerOptions = {
    kafkaHost: KAFKA_BROKER_IP,
    groupId: 'local-consume-events-from-event-hub-for-kenteken-applicatie',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
};

var topics = [TOPIC_NAME];
var consumerGroup = new kafka.ConsumerGroup(Object.assign({ id: 'consumerLocal' }, consumerOptions), topics);
consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);

consumerGroup.on('connect', function () {
    console.log('connected to ' + TOPIC_NAME + " at " + consumerOptions.kafkaHost);
})

function onMessage(message) {
    console.log('%s read msg Topic="%s" Partition=%s Offset=%d'
    , this.client.clientId, message.topic, message.partition, message.offset);
    var event = JSON.parse(message.value);
    if(event.type === 'CREATED') {
      console.log('create event received: ' + event.payment);
      event.payment._id = ObjectID(event.payment.id);
      db.collection("payments").insertOne(event.payment, function(err, result) {
        if (err) {
          throw err;
        } else {
          console.log("Payment document is inserted into payments collection.");
        }
      });
    } else if(event.type === 'UPDATED') {
      console.log('update event received: ' + event.payment);
      db.collection("payments").updateOne({'_id': ObjectID(event.payment.id)}, {'$set': event.payment}, null, function(err, result) {
        if (err) {
          throw err;
        } else if(result.result.nModified === 1) {
          console.log("Payment document is updated in payments collection.");
        } else {
          throw {'message': 'No payment record found for id: ' + event.payment.id + '.'};
        }
      });
    }

}

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

process.once('SIGINT', function () {
    async.each([consumerGroup], function (consumer, callback) {
        consumer.close(true, callback);
    });
});
