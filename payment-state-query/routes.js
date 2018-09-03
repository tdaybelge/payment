module.exports = function(app, controller) {

  app.route('/payments/:paymentId')
    .get(controller.getPaymentState);
};
