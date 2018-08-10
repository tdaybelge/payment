module.exports = function(app) {
  var paymentsController = require('./controller');

  // todoList Routes
  app.route('/payments')
    .put(paymentsController.executePayment);


  app.route('/payments/:paymentId')
    .get(paymentsController.getPaymentDetails);
};
