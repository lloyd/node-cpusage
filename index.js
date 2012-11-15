const getrusage = require('getrusage'),
     events = require('events');

// constants
const eventsEmitted = [ 'busy', 'normal', 'stats' ];
const POLL_PERIOD_MS = 2000;
var HIGH_WATER_MARK = 80.0;

// state
var polling = false;
var timer = null;

// api
module.exports = new events.EventEmitter();
module.exports._on = module.exports.on;
module.exports.on = function(eventName) {
  if (eventsEmitted.indexOf(eventName) >= 0) {
    startPolling();
  }
  return module.exports._on.apply(module.exports, arguments);
};

module.exports.stop = function() {
  stopPolling();
};

// implementation
function startPolling() {
  if (polling) return;
  polling = true;
  timer = setInterval(checkState, POLL_PERIOD_MS);
  checkState();
}

function stopPolling() {
  if (!polling) return;
  clearInterval(timer);
  timer = null;
  polling = false;
}

var averages = [ 0.0, 0.0, 0.0 ];
var numSamples = 0;
var lastUsage = null;
var lastSample = null;
function checkState() {
  if (!polling) return;
  var usage = getrusage.usage();
  // update running averages
  var curUsage = usage.utime + usage.stime;
  if (lastUsage) {
    var lastPct = averages[0];
    averages[0] = (curUsage - lastUsage) * 100.0 / ((new Date() - lastSample) / 1000.0);
    averages[1] = (averages[0] + averages[1] * Math.min(numSamples, 4)) / Math.min(numSamples + 1, 5);
    averages[2] = (averages[0] + averages[2] * Math.min(numSamples, 49)) / Math.min(numSamples + 1, 50);
    numSamples++;

    // have we transitioned across the high water mark?
    if (lastPct < HIGH_WATER_MARK && averages[0] > HIGH_WATER_MARK) {
      module.exports.emit('busy', averages[0].toFixed(2));
    } else if (lastPct > HIGH_WATER_MARK && averages[0] < HIGH_WATER_MARK) {
      module.exports.emit('normal', averages[0].toFixed(2));
    }
  }
  lastSample = new Date();
  lastUsage = curUsage;
  module.exports.emit('stats', averages);
}

