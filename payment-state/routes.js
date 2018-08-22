module.exports = function(app, controller) {

  app.route('/payments')
    .post(controller.insertPaymentState);

  app.route('/payments/:paymentId')
    .put(controller.updatePaymentState);

  app.route('/payments/:paymentId')
    .get(controller.getPaymentState);
};
