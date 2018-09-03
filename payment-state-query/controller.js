var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;

var db;
exports.init = function(database) {
  db = database;
  // if not exists, create 'payments' collection in database
  db.createCollection("payments", function(err, result) {
    if (err) throw err;
    console.log("Payments collection is created!");
  });
  return this;
};

function setId(obj) {
  obj.id = obj._id;
  delete obj._id;
  return obj;
}

exports.getPaymentState = function(req, res) {
  db.collection("payments").findOne({'_id': ObjectID(req.params.paymentId)}, function(err, payment) {
    if (err) {
      res.status(500).json(err);
    } else if(payment) {
      console.log("Payment document is found from payments collection.");
      res.status(200).json(setId(payment));
    } else {
      res.status(404).json({'message': 'No payment record found for id: ' + req.params.paymentId + '.'});
    }
  });
};
