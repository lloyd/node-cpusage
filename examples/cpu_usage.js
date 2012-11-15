// first, we want to be able to get cpu usage stats in terms of percentage
var cpuUsage = require('../');
cpuUsage.on('stats', function(stats) {
  console.log(stats);
}).on('busy', function(percentCPU) {
  console.log("process is overloaded, using " + percentCPU + "% cpu\n");
}).on('normal', function(percentCPU) {
  console.log("process is back to normal, using " + percentCPU + "% cpu\n");
});

var interval = setInterval(function() {
  console.log("doing work");
  for (var i = 0; i < 1e9;) i++;
}, 250);

process.on('SIGINT', function() {
  clearInterval(interval);
  cpuUsage.stop();
});
