/* jshint eqeqeq: false */
"use strict";

var port = 8818, api_port = 8808;
var $ = global.$ = global.$ || require('./lib/util/Require');
var _ = global._ = global._ || {};//备用

//初始化定义模块或类访问空间
$.define($, ['amqp', 'assert', 'async',
             'bower', 'body-parser',
             'colors', 'console-highlight', 'cookie-parser', 'cookie-session', 'crypto',
             'express',
             'fn.js',
             'geddy', 'grunt',
             'helmet', 'htmlout', 'http',
             'jade',
             'lru-cache',
             'memcache', 'method-override', 'minify', 'mime', 'moment', 'mongodb', 'mysql',
             'net', 'node-uuid',
             'os', 'os-name',
             'path', 'php-express',
             'querystring',
             'rabbitmq-nodejs-client', 'redis', 'request', 'scribe',
             'socket.io', 'solr-client', 'syslog',
             'underscore', 'url']);
$.define($, [__dirname + '/lib']);

var cli = new $.server.Cli();
cli.set('api_port', api_port);
//cli.init();
cli.open();
