module.exports = function(app) {
  var executeController = require('./controller');

  app.route('/payments')
    .post(executeController.executePayment);
};
