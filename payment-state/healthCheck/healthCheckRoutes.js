module.exports = function(app) {
  var healthCheck = require('./healthCheckController');

  app.route('/health')
    .get(healthCheck.checkHealth);

  app.route('/health/live')
    .get(healthCheck.isAlive);

  app.route('/health/ready')
    .get(healthCheck.isReady);

  app.route('/health/live')
    .put(healthCheck.setAlive);

  app.route('/health/ready')
    .put(healthCheck.setReady);
};
