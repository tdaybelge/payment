var fs = require('fs');

var db;
exports.init = function(database) {
  db = database;
  return this;
};

function setId(obj) {
  obj.id = obj._id;
  delete obj._id;
  return obj;
}

exports.insertPaymentState = function(req, res) {
  var payment = req.body;
  // print out payment info
  console.log("payment: " + JSON.stringify(payment));
  // insert payment into payments collection
  db.collection("payments").insertOne(payment, function(err, mongoResponse) {
    if (err) {
      res.status(500).json(err);
    } else {
      console.log("Payment document is inserted into Payments collection.");
      res.status(201).json(setId(payment));
    }
  });
};

exports.updatePaymentState = function(req, res) {
  res.status(204).end();
};

exports.getPaymentState = function(req, res) {
  var payment = JSON.parse(fs.readFileSync('mock/paymentState.json', 'utf8'));
  res.status(200).json(payment);
};
