//keys.js - depending on whether we're in prod or dev, decide what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // we are in prod - return prod keys
  module.exports = require('./prod');
} else {
  //we are in dev - return dev keys
  module.exports = require('./dev'); // get dev keys and return them
}
