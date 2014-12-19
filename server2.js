var host = 'localhost', host_api = 'localhost';
var port = 8133, port_api = 8808;
var api_url = 'http://' + host_api + ':' + port_api + '/';
var $ = global.$ = global.$ || require('./lib/util/Require');
var _ = global._ = global._ || {};//备用

//初始化定义模块或类访问空间
$.define($, ['assert', 'async', 'bower', 'body-parser', 'cookie-parser', 'cookie-session', 'crypto',
        'express', 'fn.js', 'geddy', 'helmet', 'jade', 'lru-cache', 'http', 'memcache', 'method-override',
        'mime', 'moment', 'mongodb', 'mysql', 'node-uuid', 'path', 'php-express', 'rabbitmq-nodejs-client',
        'redis', 'request', 'scribe', 'solr-client', 'syslog', 'underscore', 'url', 'util']);
$.define($, [__dirname + '/lib']);

var cfg = $.core.Config;
var err = $.core.Exception;
var app = $.express();
var php = $.php_express({binPath:'C:\Windows\System32'});
//create server
//var server = $.http.createServer(app).listen(port);

cfg.configure(__dirname + '/cfg/env.json');
cfg.configure([__dirname + '/cfg/common', __dirname + '/cfg/res', __dirname + '/cfg/' + cfg.get('env')]);
err.configure($.get('error-codes'));

//app.use("/favicon.ico", express.static(__dirname + '/stc/image/favicon.ico'));
app.set('views', $.path.join(__dirname, 'php'));
app.set('view engine', 'php');//现在只支持Linux
app.engine('php', php.engine);
app.use(/.+\.php$/, php.router);
app.use($.helmet());
app.use($.helmet.noCache({ noEtag: true }));
app.use($.express.static(__dirname + '/stc'));
//app.use($.body_parser());
app.use($.body_parser.urlencoded({extended:false}));
app.use($.body_parser.json());
app.use($.cookie_parser());
app.use($.method_override());
app.use($.cookie_session({ secret:'imagine-test', cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(function(req, res, next) {
    var _path = $.url.parse(req.url,true).pathname.substr(1);
    if(_path === 'test') {
        $.Log.info('\033[31m------------ TST  ------------\033[39m');
        $.App.test(req, res, api_url, function() {
            $.Log.info('------------ TST* ------------');
        });
    } else if(_path === ''){
        $.Log.info('\033[33m------------ JSN  ------------\033[39m');
        $.App.json(req, res, function() {
            $.Log.info('------------ JSN* ------------');
        });
    } else {
        $.Log.info('\033[36m------------ API  ------------\033[39m');
        $.App.api(req, res, function() {
            $.Log.info('------------ API* ------------');
        });
    }
});

$.http.createServer(app).listen(port);
