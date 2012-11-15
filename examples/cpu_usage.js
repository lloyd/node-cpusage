// first, we want to be able to get cpu usage stats in terms of percentage
var loaded = false;
var cpuSage = require('../');
cpuSage.on('stats', function(stats) {
  console.log(stats);
}).on('busy', function(percentCPU) {
  loaded = true;
  console.log("process is overloaded, using " + percentCPU + "% cpu\n");
}).on('normal', function(percentCPU) {
  loaded = false;
  console.log("process is back to normal, using " + percentCPU + "% cpu\n");
});

var interval = setInterval(function() {
  var howMuch = loaded ? 1e5 : 1e9 * 2;
  console.log("doing work");
  for (var i = 0; i < howMuch;) i++;
}, 250);

process.on('SIGINT', function() {
  clearInterval(interval);
  cpuSage.stop();
});
