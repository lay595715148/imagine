/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Scribe(model, config) {
    this.model = null;
    this.config = null;
    this.link = null;
    this.result = null;
    this._config = null;
    this.logger = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Scribe, $.core.Store);

module.exports = exports = Scribe;

(function() {
    Scribe.classname = 'core.Scribe';
    /**
     * @api private
     * @abstract
     */
    Scribe.prototype.init = function init() {
        var config = $.Util.clone(this.config);
        //var table = this.model.table();
        //config.path = config.path ? config.path + '/' + table : '/solr/' + table;
        this.link = new $.scribe.Scribe(config.host, config.port, {autoReconnect:true});
        this.logger = new $.scribe.Logger(this.link, config.logger);
        //$.redis.debug_mode = true;
        // always connect lazily
    };
    /**
     * 连接后可重新选择数据库
     * 
     * @param database
     * @sync
     */
    Scribe.prototype.change = function change(config, fn) {
        if($.Util.isFunction(config) && $.Util.isObject(this._config)) {
            this.config = this._config;
            this._config = undefined;
            fn = config;
        } else if($.Util.isObject(config)) {
            if(!$.Util.isObject(this._config)) {
                this._config = this.config;
            }
            this.config = config;
        } else {
            $.Util.isFunction(fn) && fn(false);
            return false;
        }

        // 先关闭
        this.close();
        this.init();
        $.Util.isFunction(fn) && fn(true);
        return true;
    };
    /**
     * 
     * @param database
     * @param fn
     */
    Scribe.prototype.close = function close(fn) {
        // 关闭
        if(!$.Util.isEmpty(this.link)) {
            this.link.close();
            $.Log.info('SCRIBE closed');
            this.logger.releaseConsole();
            $.Log.info('SCRIBE release');
        }
        $.Util.isFunction(fn) && fn();
    };
    /**
     * @api private
     */
    Scribe.prototype.connect = function connect(fn) {
        var link = this.link;
        if(!$.Util.isEmpty(this.link.opened)) {
            $.Util.isFunction(fn) && fn();
        } else {
            link.open(fn);
        }
    };
    Scribe.prototype.replaceConsole = function replaceConsole(fn) {
        var me = this;
        this.connect(function(err) {
            if(!err) {
                $.Log.info('SCRIBE replace');
                me.logger.replaceConsole();
                $.Util.isFunction(fn) && fn();
            } else {
                $.Util.isFunction(fn) && fn(false);
            }
        });
    };
    Scribe.prototype.releaseConsole = function releaseConsole(fn) {
        var me = this;
        this.connect(function(err) {
            if(!err) {
                me.logger.releaseConsole();
                $.Log.info('SCRIBE release');
                $.Util.isFunction(fn) && fn(true);
            } else {
                $.Util.isFunction(fn) && fn(false);
            }
        });
    };
    Scribe.prototype.log = function log(name, content, fn) {
        var me = this;
        var link = this.link;
        var time = $.moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        var called = $.Util.extractCalledFromStack(new RegExp("Error.+?\t.+?\t +?at (.+?)\t"));
        this.connect(function(err) {
            if(!err) {
                link.send(name, [time, called, content].join(' '));
                $.Util.isFunction(fn) && fn(true);
            } else {
                $.Util.isFunction(fn) && fn(false);
            }
        });
    };
})();
