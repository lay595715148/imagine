var port = 8809, port_api = 8808;
var Require = require('./lib/util/Require');
var request = require('request');
var _ = require('underscore');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var methodOverride = require('method-override');
var fs = require('fs');
var url = require('url');
var useragent = require('useragent');
var assert = require('assert');
var app = express();
var server = require('http').createServer(app).listen(port);
var cfg = $.core.Config;

var api_url = 'http://localhost:' + port_api + '/';

cfg.configure(__dirname + '/cfg/env.json');
cfg.configure([__dirname + '/cfg/common', __dirname + '/cfg/res', __dirname + '/cfg/' + cfg.get('env')]);

//app.use("/favicon.ico", express.static(__dirname + '/stc/image/favicon.ico'));

app.use(express.static(__dirname + '/stc'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(methodOverride());
app.use(cookieSession({ secret:'imagine-test',cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(function(req, res, next) {
    var _path = url.parse(req.url,true).pathname.substr(1);
    if(_path === 'test') {
        $.Log.info('------------ TEST ------------');
        require('./test')(req, res, api_url, function() {
            $.Log.info('------------ TEST*------------');
        });
    } else if(_path === ''){
        $.Log.info('------------ API  ------------');
        require('./api')(req, res, function() {
            $.Log.info('------------ API* ------------');
        });
    } else {
        $.Log.info('------------ WEB  ------------');
        require('./index')(req, res, function() {
            $.Log.info('------------ WEB* ------------');
        });
        /*$.Log.info('------------ NEXT ------------');
        res.statusCode = 200;
        res.json({isok:false, code:100000, data:$.get('errors.' + 100000)});
        $.Log.info('------------ NEXT*------------');*/
    }
});
/*process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});*/
