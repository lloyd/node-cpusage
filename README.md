# Your CPU Sage

## installation

    npm install cpusage

## usage

    var cpuSage = require('cpusage');
    cpuSage.on('stats', function(stats) {
      console.log(stats);
    }).on('busy', function(percentCPU) {
      console.log("process is overloaded, using " + percentCPU + "% cpu\n");
    }).on('normal', function(percentCPU) {
     console.log("process is back to normal, using " + percentCPU + "% cpu\n");
    });

## license

http://wtfpl.org
