/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Mongo(model, config) {
    this.model = null;
    this.config = null;
    this.link = null;
    this.result = null;
    this.sequence = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Mongo, $.core.Store);

module.exports = exports = Mongo;

(function() {
    Mongo.classname = 'core.Mongo';
    /**
     * @abstract
     */
    Mongo.prototype.init = function init() {
        var mongodb = $.mongodb;
        var MongoDB = mongodb.Db;
        var Server = mongodb.Server;
        //this.config = $.Conf.get('servers.mongo.master');
        this.link = new MongoDB(this.config.database, new Server(this.config.host, this.config.port), { safe : true });
        this.sequence = $.Util.isString(this.config.sequence) && this.config.sequence ? this.config.sequence : 'lay_sequence';
    };

    /**
     * 连接后可重新选择数据库
     * 
     * @param database
     * @sync
     */
    Mongo.prototype.choose = function choose(database, fn) {
        var me = this;
        var config = this.config;
        if(!$.Util.isString(database)) {
            database = config.database;
        }
        // 先关闭
        if(!$.Util.isEmpty(this.link) && this.link.state === 'connected') {
            this.link.close(function() {
                me.link = new MongoDB(database, new Server(config.host, config.port), { safe : true });
                $.Util.isFunction(fn) && fn();
            });
        }

    };
    /**
     * 连接后可重新选择数据库
     * 
     * @param database
     */
    Mongo.prototype.change = function change(config, fn) {
        var mongodb = $.mongodb;
        var MongoDB = mongodb.Db;
        var Server = mongodb.Server;
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

        var config = this.config;

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
    Mongo.prototype.close = function close(fn) {
        // 关闭
        if(!$.Util.isEmpty(this.link) && this.link.state === 'connected') {
            this.link.close(function() {
                $.Util.isFunction(fn) && fn();
            });
        }

    };
    /**
     * @api private
     */
    Mongo.prototype.connect = function connect(fn) {
        var assert = require('assert');
        var config = this.config;
        var link = this.link;
        if(link.state === 'disconnected') {
            link.open(function(err) {
                assert.equal(null, err);
                if(config.username && config.password) {
                    link.authenticate(config.username, config.password, function(err, res) {
                        assert.equal(null, err);
                        $.Util.isFunction(fn) && fn();
                    });
                } else {
                    $.Util.isFunction(fn) && fn();
                }
            });
        } else {
            $.Util.isFunction(fn) && fn();
        }
    };
    /**
     * @api private
     * @param name
     * @param fn
     * @returns
     */
    Mongo.prototype.nextSequence = function nextSequence(name, step, fn) {
        var assert = require('assert');
        var me = this;
        var table = this.model.table();
        var link = this.link;
        var sequence = this.sequence;//sequence数据表
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        name = args.length ? args.shift() || '_id' : '_id';
        name = table + '.' + name;
        step = args.length ? args.shift() || 1 : 1;
        step = $.Util.isInteger(step) ? step : 1;

        me.connect(function() {
            $.Log.info('MONGO next sequence', table);
            link.collection(sequence).findAndModify({ name : name }, [], { $inc : { seq : step } }, { 'new':true }, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result.seq);
            });
        });
    };
    Mongo.prototype.insert = function insert(obj, opts, fn) {
        var assert = require('assert');
        var me = this;
        var docs = {};
        var async = new $.util.Async();
        var link = this.link;
        var model = this.model;
        var table = this.model.table();
        var columns = this.model.columns();
        var sequence = this.model.sequence ? this.model.sequence() : this.model.prototype.sequence();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        obj = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};

        if(!$.Util.isA(obj, model)) {
            $.Util.isFunction(fn) && fn(false);
            return false;
        }

        Object.keys(columns).map(function(pro, index) {
            var field = columns[pro];
            if(field === sequence && (!$.Util.isInteger(obj[sequence]) || obj[sequence] !== 0)) {
                async.push(me.nextSequence, [sequence], me, function(next) {
                    docs[field] = next;
                });
            } else {
                docs[field] = obj[pro];
            }
        });
        
        async.push(me.connect, [], me, function() {
            $.Log.info('MONGO insert', table, $.Util.toString(docs));
            link.collection(table).insert(docs, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        });
        async.exec();
    };
    Mongo.prototype.update = function update(selector, docs, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        docs = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        //opts.

        me.connect(function() {
            $.Log.info('MONGO update', table, $.Util.toString(selector), $.Util.toString(docs));
            link.collection(table).update(selector, docs, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        });
    };
    /**
     * 使用的findAndModif方法
     * @param selector
     * @param docs
     * @param opts
     * @param fn
     */
    Mongo.prototype.modify = function modify(selector, docs, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        docs = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        opts['new'] = true;

        me.connect(function() {
            $.Log.info('MONGO modify', table, $.Util.toString(selector), $.Util.toString(docs));
            link.collection(table).findAndModify(selector, [], docs, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        });
    };
    /**
     * delete是关键字，所以使用remove，让eclipse不报错
     */
    Mongo.prototype.remove = function remove(selector, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        
        if($.Util.isPureObject(selector)) {
            Object.keys(columns).map(function(pro, index) {
                var field = columns[pro];
                if(!$.Util.isUndefined(selector[field])) {
                } else if(!$.Util.isUndefined(selector[pro])) {
                    var value = selector[pro];
                    delete selector[pro];
                    selector[field] = value;
                } else {
                    delete selector[pro];
                }
            });
        } else {
            var value = selector;
            selector = {};
            selector[primary] = value;
        }
        me.connect(function() {
            $.Log.info('MONGO remove', table, $.Util.toString(selector));
            link.collection(table).remove(selector, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        });
    };
    Mongo.prototype.select = function select(selector, fields, num, offset, order, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var columns = this.model.columns();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        fields = args.length ? args.shift() || [] : [];
        num = args.length ? args.shift() || 0 : 0;
        offset = args.length ? args.shift() || 0 : 0;
        order = args.length ? args.shift() || '' : '';
        opts = args.length ? args.shift() || {} : {};

        me.connect(function() {
            $.Log.info('MONGO select', table, $.Util.toString(selector), $.Util.toString(fields));
            link.collection(table).find(selector, fields, opts).toArray(function(err, result) {
                assert.equal(null, err);
                me.result = result;
                var items = [], obj = {};
                result.forEach(function(ret) {
                    // 映射回去
                    Object.keys(columns).map(function(pro) {
                        obj[pro] = ret[columns[pro]];
                    });
                    items.push(new me.model(obj));
                });
                $.Util.isFunction(fn) && fn(items);
            });
        });
    };
    Mongo.prototype.selectOne = function selectOne(selector, fields, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var columns = this.model.columns();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        fields = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};

        me.connect(function() {
            $.Log.info('MONGO selectOne', table, $.Util.toString(selector), $.Util.toString(fields));
            link.collection(table).findOne(selector, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                var item = null, obj = {};
                if(result) {
                    Object.keys(columns).map(function(pro) {
                        obj[pro] = result[columns[pro]];
                    });
                    item = new me.model(obj);
                    $.Util.isFunction(fn) && fn(item);
                } else {
                    $.Util.isFunction(fn) && fn(item);
                }
            });
        });
    };
    Mongo.prototype.count = function count(selector, opts, fn) {
        var assert = require('assert');
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};

        me.connect(function() {
            $.Log.info('MONGO count', table, $.Util.toString(selector));
            link.collection(table).count(selector, opts, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        });
    };
    /**
     * 通过主键获取单个
     * @param Number id
     * @param Object opts
     * @param Function fn
     */
    Mongo.prototype.get = function get(id, opts, fn) {
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var selector = {};
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        
        selector[primary] = id;
        this.selectOne(selector, [], opts, fn);
    };
    /**
     * 通过主键获取多个
     * @param Array ids
     * @param Object opts
     * @param Function fn
     */
    Mongo.prototype.getList = function getList(ids, opts, fn) {
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var selector = {};
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        
        selector[primary]['$in'] = ids;
        this.select(selector, [], opts, fn);
    };
    /**
     * 通过主键删除单个
     * @param Number id
     * @param Object opts
     * @param Function fn
     */
    Mongo.prototype.del = function del(id, opts, fn) {
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var selector = {};
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        
        selector[primary] = id;
        this.remove(selector, [], opts, fn);
    };
    /**
     * 通过主键删除多个
     * @param Array ids
     * @param Object opts
     * @param Function fn
     */
    Mongo.prototype.delList = function delList(ids, opts, fn) {
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var selector = {};
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};

        selector[primary]['$in'] = ids;
        this.remove(selector, [], opts, fn);
    };
    /**
     * 通过主键更新单个
     * @param Number id
     * @param Object opts
     * @param Function fn
     */
    Mongo.prototype.upd = function upd(id, info, opts, fn) {
        var table = this.model.table();
        var columns = this.model.columns();
        var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
        var selector = {};
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        info = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        
        selector[primary] = id;
        this.modify(selector, {$set:info}, opts, fn);
    };
})();
