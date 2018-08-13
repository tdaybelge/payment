var fs = require('fs');

exports.insertPaymentState = function(req, res) {
  var response = JSON.parse(fs.readFileSync('mock/paymentState.json', 'utf8'));
  res.status(201).json(response);
};

exports.updatePaymentState = function(req, res) {
  res.status(204).end();
};

exports.getPaymentState = function(req, res) {
  var payment = JSON.parse(fs.readFileSync('mock/paymentState.json', 'utf8'));
  res.status(200).json(payment);
};
