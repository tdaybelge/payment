module.exports = function(app, database) {
  var paymentsController = require('./controller')(database);

  app.route('/payments')
    .post(paymentsController.insertPaymentState);

  app.route('/payments/:paymentId')
    .put(paymentsController.updatePaymentState);

  app.route('/payments/:paymentId')
    .get(paymentsController.getPaymentState);
};
