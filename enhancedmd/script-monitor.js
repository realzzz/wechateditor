var forever = require('forever-monitor');

var child = new (forever.Monitor)('bin/www', {
    max: 10,
    silent: false,
    args: []
});

child.on('restart', function() {
    console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
    console.error('Forever detected script exited with code ' + code);
    //if (143 === code) child.stop(); // don't restart the script on SIGTERM
});

child.start();
