var port = 8818, api_port = 8808;
var $ = global.$ = global.$ || require('./lib/util/Require');
var _ = global._ = global._ || {};//备用

//初始化定义模块或类访问空间
$.define($, ['amqp', 'assert', 'async', 'bower', 'body-parser', 'cookie-parser', 'cookie-session', 'crypto',
        'express', 'fn.js', 'geddy', 'helmet', 'jade', 'lru-cache', 'http', 'memcache', 'method-override',
        'mime', 'moment', 'mongodb', 'mysql', 'net', 'node-uuid', 'os', 'os-name', 'path', 'php-express', 
        'querystring', 'rabbitmq-nodejs-client', 'redis', 'request', 'scribe', 'socket.io', 'solr-client',
        'syslog', 'underscore', 'url', 'util']);
$.define($, [__dirname + '/lib']);

var cli = new $.server.Cli();
cli.init();
cli.set('port', port);
cli.set('api_port', api_port);
cli.open();