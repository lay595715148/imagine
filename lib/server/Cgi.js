
function Cgi() {
    this.io = null;
    this.app = null;
    this.server = null;
    this.settings = {};
}

module.exports = exports = Cgi;

Cgi.prototype.init = function init() {
    var cfg = $.core.Config;
    var err = $.core.Exception;
    cfg.configure(__dirname + '/../../cfg/env.json');
    cfg.configure(__dirname + '/../../cfg/common');
    cfg.configure(__dirname + '/../../cfg/res');
    cfg.configure(__dirname + '/../../cfg/' + cfg.get('env'));
    err.configure($.get('errors'));
};
Cgi.prototype.set = function set(k, v) {
    this.settings[k] = v;
};
Cgi.prototype.open = function open() {
    var host = this.settings.host || '127.0.0.1';
    var port = this.settings.port || 8808;
    var api_host = this.settings.api_host || host;
    var api_port = this.settings.api_port || port;
    var api_url = this.settings.api_url || 'http://' + api_host + ':' + api_port + '/';
    //var php = $.php_express({binPath:'C:\php-5.4.17\php.exe'});
    var app = this.app = $.express();
    var server = this.server = $.http.createServer(app).listen(port);
    var io = this.io = $.socket_io.listen(server);
    
    //app.param('id', /^\d+$/);
    //app.use("/favicon.ico", express.static(__dirname + '/stc/image/favicon.ico'));
    //app.set('views', $.path.join(__dirname, 'php'));
    //app.set('view engine', 'php');//现在只支持Linux
    //app.engine('php', php.engine);
    //app.use(/.+\.php$/, php.router);
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
        var _path = $.url.parse(req.url, true).pathname.substr(1);
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
        } else if(/^io\/.*/.test(_path)){
            $.Log.info('\033[33m------------ IO   ------------\033[39m');
            $.App.io(io, req, res, function() {
                $.Log.info('------------ IO*  ------------');
            });
        } else {
            $.Log.info('\033[36m------------ API  ------------\033[39m');
            $.App.api(req, res, function() {
                $.Log.info('------------ API* ------------');
            });
        }
    });
};
