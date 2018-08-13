var fs = require('fs');

exports.transferMoney = function(req, res) {
  var response = JSON.parse(fs.readFileSync('mock/moneyTransfer.json', 'utf8'));
  res.status(201).json(response);
};
