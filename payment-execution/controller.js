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
    request.post({url:'http://192.168.231.128:30112/payments', json: payment}, callback(resolve, reject));
  });
}

function enrichPayment(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment enriched: ', JSON.stringify(payment));
    request.put({url:'http://192.168.231.128:31777/payments/payment', json: payment}, callback(resolve, reject));
  });
}

function validatePayment(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment validated: ', JSON.stringify(payment));
    request.post({url:'http://192.168.231.128:31680/payments/payment', json: payment}, callback(resolve, reject, payment));
  });
}

function updatePaymentState(payment) {
  return new Promise(function(resolve, reject) {
    console.log('payment state update: ', JSON.stringify(payment));
    request.put({url:'http://192.168.231.128:30112/payments/' + payment.id, json: payment}, callback(resolve, reject, payment));
  });
}

function moneyTransfer(payment) {
  return new Promise(function(resolve, reject) {
    console.log('money transfer: ', JSON.stringify(payment));
    request.put({url:'http://192.168.231.128:31982/transfers', json: payment}, callback(resolve, reject));
  });
}

function sendNotification(payment) {
  return new Promise(function(resolve, reject) {
    console.log('send notification: ', JSON.stringify(payment));
    request.post({url:'http://192.168.231.128:32275/payments/payment', json: payment}, callback(resolve, reject, payment));
  });
}

function callback(resolve, reject, reqBody) {
  return function(error, httpResponse, resBody){
    if(error) {
      console.error("error");
      reject(error);
    } else if(200 <= httpResponse.statusCode && httpResponse.statusCode< 300) {
      if(resBody) {
          resolve(resBody);
      } else {
          resolve(reqBody);
      }
    } else {
      console.error("http error");
      reject(httpResponse);
    }
  }
}
