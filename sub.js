var rabbitHub = require('rabbitmq-nodejs-client');

var subHub = rabbitHub.create( { host:'192.168.159.117', task: 'sub', channel: 'myChannel' } );
subHub.on('connection', function(hub) {

    hub.on('message', function(msg) {
        console.log(msg);
    }.bind(this));

});
subHub.connect();
