var port = 8808, port_api = 8809;
var api_url = 'http://localhost:' + port_api + '/';
var $ = global.$ = global.$ || require('./lib/util/Require');

$.define($, ['async', 'body-parser', 'cookie-parser', 'cookie-session',
        'express', 'http', 'memcache', 'method-override', 'moment', 'mongodb',
        'mysql', 'redis', 'underscore', __dirname + '/lib']);

var cfg = $.core.Config;
var app = $.express();
//create server
var server = $.http.createServer(app).listen(port);

cfg.configure(__dirname + '/cfg/env.json');
cfg.configure([__dirname + '/cfg/common', __dirname + '/cfg/res', __dirname + '/cfg/' + cfg.get('env')]);

//app.use("/favicon.ico", express.static(__dirname + '/stc/image/favicon.ico'));
app.use($.express.static(__dirname + '/stc'));
app.use($.body_parser());
app.use($.body_parser.json());
app.use($.body_parser.urlencoded());
app.use($.cookie_parser());
app.use($.method_override());
app.use($.cookie_session({ secret:'imagine-test',cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(function(req, res, next) {
    var _path = $('url').parse(req.url,true).pathname.substr(1);
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
    }
});
