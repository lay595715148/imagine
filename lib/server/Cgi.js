/* jshint eqeqeq: false */
/* global $ */
"use strict";

// class definition
function Cgi(port) {
    //visible properties
    this.port = port;
    this.io = null;
    this.app = null;
    this.server = null;
    this.settings = null;
    
    this.init();
}

// module export
module.exports = exports = Cgi;

// anonymous function
(function() {
    // static private hidden variable
    var _classname = 'server.Cgi';
    // static private hidden method
    var _regexp = function(name, fn) {
        if(fn instanceof RegExp) {
            return function(req, res, next, val) {
                var captures = fn.exec(String(val));
                if(captures) {
                    req.params[name] = captures;
                    next();
                } else {
                    next('route');
                }
            };
        }
    };
    // static public visible properties
    Cgi.classname = _classname;
    
    // hidden properties
    // Setter/Getter
    Cgi.prototype.__defineSetter__('name', function(name) {
        if($.Util.isString(name))
            this.name = name;
    });
    Cgi.prototype.__defineGetter__('name', function() {
        return this.name;
    });
    
    // public method
    Cgi.prototype.init = function init() {
        var cfg = $.core.Config;
        var err = $.core.Exception;
        cfg.configure(__dirname + '/../../cfg/env.json');
        cfg.configure(__dirname + '/../../cfg/common');
        cfg.configure(__dirname + '/../../cfg/res');
        cfg.configure(__dirname + '/../../cfg/' + cfg.get('env'));
        err.configure($.get('errors'));
        
        this.settings = {};
        
        //$.Log.useScribe();
        return this;
    };
    Cgi.prototype.set = function set(k, v) {
        this.settings[k] = v;
        return this;
    };
    Cgi.prototype.open = function open() {
        var host = this.settings.host || '127.0.0.1';
        var port = this.port || this.settings.port || 8808;
        var api_host = this.settings.api_host || host;
        var api_port = this.settings.api_port || port;
        var api_url = this.settings.api_url || 'http://' + api_host + ':' + api_port + '/';
        //var php = $.php_express({binPath:'C:\php-5.4.17\php.exe'});
        var app = this.app = $.express();
        var server = this.server = $.http.createServer(app).listen(port);
        var io = this.io = $.socket_io.listen(server);
        //var server = ;
        
        //app.set('views', $.path.join(__dirname, 'php'));
        //app.set('view engine', 'php');//现在只支持Linux
        //app.engine('php', php.engine);
        //app.use(/.+\.php$/, php.router);
        app.use($.helmet());
        app.use($.helmet.noCache({ noEtag: true }));
        app.use($.express.static(__dirname + '/../../stc'));
        //app.use($.body_parser());
        app.use($.body_parser.urlencoded({extended:false}));
        app.use($.body_parser.json());
        app.use($.cookie_parser());
        app.use($.method_override());
        app.use($.cookie_session({ secret:'imagine-test', cookie: { maxAge: 60 * 60 * 1000 }}));
        app.param(_regexp);
        app.param('id', /^\d+$/);
        //app.use("/favicon.ico", $.express.static(__dirname + '/stc/image/favicon.ico'));
        app.use(function(req, res, next) {
            var _path = $.url.parse(req.url, true).pathname;//.substr(0);
            if(_path === '/test') {
                $.Log.info($.colors.red('------------ TST -------------'));
                $.App.test(req, res, api_url, function() {
                    $.Log.info('------------ TST* ------------');
                });
            } else if(_path === '/'){
                $.Log.info($.colors.green('------------ JSN -------------'));
                $.App.json(req, res, function() {
                    $.Log.info('------------ JSN* ------------');
                });
            } else if(/^\/io\/.*/.test(_path)){
                $.Log.info($.colors.yellow('------------ IO --------------'));
                $.App.io(io, req, res, function() {
                    $.Log.info('------------ IO* -------------');
                });
            } else {
                $.Log.info($.colors.cyan('------------ API -------------'));
                $.App.api(req, res, function() {
                    $.Log.info('------------ API* ------------');
                });
            }
        });
        return this;
    };
})();
