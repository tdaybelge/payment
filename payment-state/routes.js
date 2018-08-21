module.exports = function(app, db) {
  var paymentsController = require('./controller').init(db);

  app.route('/payments')
    .post(paymentsController.insertPaymentState);

  app.route('/payments/:paymentId')
    .put(paymentsController.updatePaymentState);

  app.route('/payments/:paymentId')
    .get(paymentsController.getPaymentState);
};
