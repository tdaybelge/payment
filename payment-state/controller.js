var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var options = {
  useMongoClinet: true,
  uri_decode_auth: true,
  auth: {authdb: 'admin'},
  user: 'root',
  password: 'dBnL9WG4IN',
}

var url = "mongodb://my-mongodb:27017/my-mongodb";

exports.insertPaymentState = function(req, res) {
  var payment = req.body;
  // print out payment info
  console.log("payment: " + JSON.stringify(payment));
  MongoClient.connect(url, options, function(err, db) {
    if (err) throw err;
    // db pointing to newdb
    console.log("Switched to " + db.databaseName + " database");
    // if not exists, create 'payments' collection in database
    db.createCollection("payments", function(err, result) {
        if (err) throw err;
        console.log("Payments collection is created!");
    });
    // insert payment into payments collection
    db.collection("payments").insertOne(payment, function(err, res) {
        if (err) throw err;
        console.log("Payment document is inserted into Payments collection.");
    });

    // close the connection
    db.close();
 });
  res.status(201).json(payment);
};

exports.updatePaymentState = function(req, res) {
  res.status(204).end();
};

exports.getPaymentState = function(req, res) {
  var payment = JSON.parse(fs.readFileSync('mock/paymentState.json', 'utf8'));
  res.status(200).json(payment);
};
