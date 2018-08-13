module.exports = function(app) {
  var transferController = require('./controller');

  app.route('/transfers')
    .put(transferController.transferMoney);
};
