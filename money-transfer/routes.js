module.exports = function(app) {
  var transferController = require('./controller');

  app.route('/transfers')
    .post(transferController.transferMoney);
};
