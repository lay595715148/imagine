/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Cli() {
    this.io = null;
    this.app = null;
    this.server = null;
    this.settings = null;
    
    this.init();
}

module.exports = exports = Cli;

(function() {
    /**
     * 
     */
    Cli.prototype.init = function init() {
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
    Cli.prototype.set = function set(k, v) {
        this.settings[k] = v;
        return this;
    };
    Cli.prototype.open = function open() {
    };
    Cli.prototype.test = function test() {
        var host = this.settings.host || '127.0.0.1';
        var port = this.port || this.settings.port || 8808;
        var api_host = this.settings.api_host || host;
        var api_port = this.settings.api_port || port;
        var api_url = this.settings.api_url || 'http://' + api_host + ':' + api_port + '/';

        var cmd = 'user_login';
        var json = {
            sid : '',
            cmd : cmd,
            headers : {},
            data : {}
        };
        
        if(cmd == 'user_login') {
            json.data.username = 'username';
            json.data.password = 'password';
        } else {
            
        }
        
        $.Log.info('JSON : <---');
        $.Log.info(JSON.stringify(json));
        $.Log.info('JSON : --->');
        $.Log.info('REQUEST : <---');
        $.request.post({
            url : api_url,
            form : {
                json : JSON.stringify(json)
            }
        }, function(err, rsp, body) {
            $.Log.info('Error : ');
            $.Log.info(err);
            //$.Log.info('Response:');
            //$.Log.info(rsp);
            $.Log.info('Body : ');
            $.Log.info(body);
            if(err) {
                $.Log.info({isok:false, error:err});
                //res.json({isok:false, error:err});
            } else {
                //$.Log.info(body);
                //res.send(body);
                //res.end();
            }
            $.Log.info('REQUEST : --->');
            //callback && callback();
        });
        //console.log($.grunt);

        return this;
    };
})();
