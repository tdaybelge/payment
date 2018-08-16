var readiness = true;
var liveliness = true;

module.exports = {

  checkHealth: function(req, res) {
    console.log('health: ', readiness && liveliness);
    res.status((liveliness && readiness) ? 200 : 500).json({
      "readiness": readiness,
      "liveliness": liveliness
    });
  },

  isAlive: function(req, res) {
    console.log('alive: ', liveliness);
    res.status(liveliness ? 204 : 500).end();
  },

  isReady: function(req, res) {
    console.log('ready: ', readiness);
    res.status(readiness ? 204 : 500).end();
  },

  setAlive: function(req, res) {
    liveliness = req.body.state;
    console.log('set alive: ', liveliness);
    res.status(204).end();
  },

  setReady: function(req, res) {
    readiness = req.body.state;
    console.log('set ready: ', readiness);
    res.status(204).end();
  }
}
