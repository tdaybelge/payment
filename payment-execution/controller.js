var request = require('request');
exports.executePayment = function(req, res) {
  insertPaymentState(req.body)
    .then(enrichPayment)
    .then(validatePayment)
    .then(updatePaymentState)
    .then(moneyTransfer)
    .then(updatePaymentState)
    .then(sendNotification)
    .then(function(response) {
      console.log("success: ", response);
      res.status(200).json(response);
    })
    .catch(function(error) {
      console.error(error);
      var statusCode = error.statusCode || 500;
      res.status(statusCode).json(error);
    });
};

function insertPaymentState(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment state insert: ', JSON.stringify(payment));
    request.post({url:'http://payment-state:8080/payments', json: payment}, callback(resolve, reject));
  });
}

function enrichPayment(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment enriched: ', JSON.stringify(payment));
    request.put({url:'http://payment-enrichment:3000/payments/payment', json: payment}, callback(resolve, reject));
  });
}

function validatePayment(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment validated: ', JSON.stringify(payment));
    request.post({url:'http://payment-validation:3002/payments/payment', json: payment}, callback(resolve, reject, payment));
  });
}

function updatePaymentState(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment state update: ', JSON.stringify(payment));
    request.put({url:'http://payment-state:8080/payments/' + payment.id, json: payment}, callback(resolve, reject, payment));
  });
}

function moneyTransfer(payment) {
  return new Promise(function(resolve, reject) {
    console.log('money transfer: ', JSON.stringify(payment));
    request.put({url:'http://money-transfer:8081/transfers', json: payment}, callback(resolve, reject));
  });
}

function sendNotification(payment) {
  return new Promise(function(resolve, reject) {
    console.log('send notification: ', JSON.stringify(payment));
    request.post({url:'http://payment-notification:3001/payments/payment', json: payment}, callback(resolve, reject, payment));
  });
}

function callback(resolve, reject, reqBody) {
  return function(error, httpResponse, resBody){
    if(error) {
      console.error("error");
      reject(error);
    } else if(200 <= httpResponse.statusCode && httpResponse.statusCode< 300) {
      if(reqBody) {
          resolve(reqBody);
      } else {
          resolve(resBody);
      }
    } else {
      console.error("http error");
      reject(httpResponse);
    }
  }
}
