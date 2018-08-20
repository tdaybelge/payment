var fs = require('fs');

class Controller{

  constructor(database) {
    this.db = database;
    console.log("controller: ", this.db);
  }

  insertPaymentState(req, res) {
    var payment = req.body;
    console.log("insertPaymentState: ", this.db);
    this.db.collection("payments").insert(payment, (err, result) => {
      if(err) {
        res.status(500).json(err);
      } else {
        payment.id = result.insertedId;
        res.status(201).json(payment);
      }
    });
  }

  updatePaymentState(req, res) {
    res.status(204).end();
  }

  getPaymentState(req, res) {
    var payment = JSON.parse(fs.readFileSync('mock/paymentState.json', 'utf8'));
    res.status(200).json(payment);
  }
}

module.exports = function(database) {
  var controller = new Controller(database);
  console.log(controller);
  return controller;
}
