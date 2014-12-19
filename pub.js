var rabbitHub = require('rabbitmq-nodejs-client');

var pubHub = rabbitHub.create( { host:'192.168.159.117', task: 'pub', channel: 'myChannel' } );
pubHub.on('connection', function(hub) {

    hub.send('Hello World!');

});
pubHub.connect();