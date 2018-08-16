module.exports = function(app) {
  var paymentsController = require('./controller');

  app.route('/payments')
    .post(paymentsController.insertPaymentState);

  app.route('/payments/:paymentId')
    .put(paymentsController.updatePaymentState);

  app.route('/payments/:paymentId')
    .get(paymentsController.getPaymentState);
};
