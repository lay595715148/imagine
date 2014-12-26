/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Rabbitmq(model, config) {
    this.model = null;
    this.config = null;
    this.link = null;
    this.sublink = null;
    this.publink = null;
    this.result = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Rabbitmq, $.core.Store);

module.exports = exports = Rabbitmq;

(function() {
    Rabbitmq.classname = 'core.Rabbitmq';
    /**
     * @api private
     * @abstract
     */
    Rabbitmq.prototype.init = function init() {
        //var config = $.Util.clone(this.config);
        //var table = this.model.table();
        //config.task = config.task ? config.task : table;
        //config.channel = config.channel ? config.channel : table;
        //this.link = $.rabbitmq_nodejs_client.create(config);
    };
    /**
     * 连接后可重新选择数据库
     * 
     * @param database
     * @sync
     */
    Rabbitmq.prototype.change = function change(config, fn) {
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
    Rabbitmq.prototype.close = function close(fn) {
        // 关闭
        if(!$.Util.isEmpty(this.link)) {
            this.link.end();
        }
        $.Util.isFunction(fn) && fn();
    };
    /**
     * @api private
     */
    Rabbitmq.prototype.connect = function connect(fn) {
        var me = this;
        var link = this.link;
        if(this.link && this.link.connection) {
            console.log(1);
            $.Util.isFunction(fn) && fn();
        } else {
            console.log(2);
            link.on('connection', function() {
                // no arguments - we've connected
                $.Log.info('we\'ve connected');
                $.Util.isFunction(fn) && fn();
            });

            /*link.on('message', function() {
                // no arguments - connection has been closed
                $.Util.isFunction(fn) && fn.apply(me, ['message'].concat(arguments));
            });

            link.on('ack', function() {
                // no arguments - socket timed out
                $.Util.isFunction(fn) && fn.apply(me, ['ack'].concat(arguments));
            });*/
            link.on('close', function() {
                // no arguments - socket timed out
                //$.Util.isFunction(fn) && fn.apply(me, ['close'].concat(arguments));
                $.Log.info('connection closed');
            });

            link.on('error', function(e) {
                // there was an error - exception is 1st argument
                $.Log.error(e);
            });

            //$.Util.isFunction(fn) && fn();
            link.connect();
        }
    };
    Rabbitmq.prototype.pub = function pub(opts, fn) {
        var me = this;
        var config = $.Util.clone(this.config);
        var table = this.model.table();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        opts = args.length ? args.shift() || {} : {};
        
        config.task = config.task ? config.task : 'pub';
        config.channel = config.channel ? config.channel : table;
        if(!this.publink) {
            this.publink = $.rabbitmq_nodejs_client.create(config);
            this.publink.on('connection', function() {
                // no arguments - we've connected
                $.Log.info('we\'ve connected');
                fn(me.publink);
            });
            this.publink.on('error', function() {
                $.Log.error(e);
            });
            this.publink.connect();
        } else {
            fn(me.publink);
        }
    };
    Rabbitmq.prototype.sub = function sub(opts, fn) {
        var me = this;
        var config = $.Util.clone(this.config);
        var table = this.model.table();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        opts = args.length ? args.shift() || {} : {};
        
        config.task = config.task ? config.task : 'sub';
        config.channel = config.channel ? config.channel : table;
        if(!this.sublink) {
            this.sublink = $.rabbitmq_nodejs_client.create(config);
            this.sublink.on('connection', function() {
                // no arguments - we've connected
                $.Log.info('we\'ve connected');
                fn(me.sublink);
            });
            this.sublink.on('error', function() {
                $.Log.error(e);
            });
            this.sublink.connect();
        } else {
            fn(me.sublink);
        }
    };
    Rabbitmq.prototype.test = function test(fn) {
        var me = this;
        var columns = this.model.columns();
        var table = this.model.table();
        //var link = this.link;
        me.connect(function() {
            //console.log(link);
            $.Util.isFunction(fn) && fn(true);
        });
    };
    /**
     * 内部类MemcacheException
     */
    function RabbitmqException() {
        $.core.Exception.call(this, $.error.SOLR_ERROR.message, $.error.SOLR_ERROR.code);
    }

    $.Util.inherits(RabbitmqException, $.core.Exception);

    RabbitmqException.classname = 'core.Rabbitmq.RabbitmqException';
})();
