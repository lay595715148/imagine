/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Redis() {
    this.model = null;
    this.config = null;
    this.link = null;
    this.result = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Redis, $.core.Store);

module.exports = exports = Redis;

(function() {
    Redis.classname = 'core.Redis';
    Redis.TTL_MIN = 60;//1 minute and min
    Redis.TTL_HOUR = 3600;//1 hour
    Redis.TTL_DAY = 86400;//1 day
    Redis.TTL_MAX = 0;//30 days and max
    Redis.commands = [/*"get", "set", "del", */"setnx", "setex", "append", "strlen",
            "exists", "setbit", "getbit", "setrange", "getrange", "substr", "incr",
            "decr", "mget", "rpush", "lpush", "rpushx", "lpushx", "linsert",
            "rpop", "lpop", "brpop", "brpoplpush", "blpop", "llen", "lindex",
            "lset", "lrange", "ltrim", "lrem", "rpoplpush", "sadd", "srem",
            "smove", "sismember", "scard", "spop", "srandmember", "sinter",
            "sinterstore", "sunion", "sunionstore", "sdiff", "sdiffstore",
            "smembers", "zadd", "zincrby", "zrem", "zremrangebyscore",
            "zremrangebyrank", "zunionstore", "zinterstore", "zrange",
            "zrangebyscore", "zrevrangebyscore", "zcount", "zrevrange", "zcard",
            "zscore", "zrank", "zrevrank", "hset", "hsetnx", "hget", "hmset",
            "hmget", "hincrby", "hdel", "hlen", "hkeys", "hvals", "hgetall",
            "hexists", "incrby", "decrby", "getset", "mset", "msetnx", "randomkey",
            "select", "move", "rename", "renamenx", "expire", "expireat", "keys",
            "dbsize", "auth", "ping", "echo", "save", "bgsave", "bgrewriteaof",
            "shutdown", "lastsave", "type", "multi", "exec", "discard", "sync",
            "flushdb", "flushall", "sort", "info", "monitor", "ttl", "persist",
            "slaveof", "debug", "config", "subscribe", "unsubscribe", "psubscribe",
            "punsubscribe", "publish", "watch", "unwatch", "cluster", "restore",
            "migrate", "dump", "object", "client", "eval", "evalsha"];
    /*Redis.commands.forEach(function (fullCommand) {
        var command = fullCommand.split(' ')[0];

        Redis.prototype[command] = function (args, callback) {
            var me = this;
            var columns = this.model.columns();
            var table = this.model.table();
            var link = this.link;
            var docs = {};
            var value = '';

            if(!$.Util.isFunction(fn)) {
                lifetime = fn;
                fn = null;
            }

            if($.Util.isA(obj, me.model)) {
                Object.keys(columns).map(function(pro) {
                    var field = columns[pro];
                    docs[field] = obj[pro];
                });
            }

            // 连接
            this.connect(function() {
                value = $.Util.toString(docs);
                link.set(table + '.' + key, value, function(err, result) {
                    assert.equal(null, err);
                    me.result = result;
                    $.Util.isFunction(fn) && fn(result);
                }, lifetime);
            });
            if ($.Util.isArray(args) && $.Util.isFunction(callback)) {
                args.push(callback);
                return this.link[command].apply(this.link, args);
            } else {
                return this.link[command].apply(this.link, [].slice.call(arguments, 0));
            }
        };
        Redis.prototype[command.toUpperCase()] = $.redis.RedisClient.prototype[command];
    });*/

    /**
     * @api private
     * @abstract
     */
    Redis.prototype.init = function init() {
        var config = this.config;
        this.link = $.redis.createClient(config.port, config.host);
        //$.redis.debug_mode = true;
        // always connect lazily
    };
    /**
     * 连接后可重新选择数据库
     * 
     * @param database
     * @sync
     */
    Redis.prototype.change = function change(config, fn) {
        var args = [].slice.call(arguments, 0);

        config = args.shift() || {};//先获取config
        fn = args.pop() || function() {};

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
            fn(false);
            return false;
        }

        // 先关闭
        this.close();
        this.init();

        fn(true);
        return true;
    };
    /**
     * 
     * @param database
     * @param fn
     */
    Redis.prototype.close = function close(fn) {
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};

        // 关闭
        if(!$.Util.isEmpty(this.link)) {
            this.link.end();
            $.Log.error('REDIS closed');
        }
        fn();
    };
    /**
     * @api private
     */
    Redis.prototype.connect = function connect(fn) {
        var link = this.link;
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};

        if(this.link.connected) {
            fn();
        } else {
            link.on('connect', function() {
                // no arguments - we've connected
                //fn();
                $.Log.info('REDIS we\'ve connected');
            });

            link.on('close', function() {
                // no arguments - connection has been closed
                $.Log.error('REDIS connection has been closed');
            });

            link.on('timeout', function() {
                // no arguments - socket timed out
                $.Log.error('REDIS socket timed out');
            });

            link.on('error', function(e) {
                // there was an error - exception is 1st argument
                $.Log.error('REDIS', e);
            });

            fn();
        }
    };
    /**
     * 
     * @param database
     * @param fn
     */
    Redis.prototype.set = function set(key, obj, lifetime, fn) {
        var me = this;
        var columns = this.model.columns();
        var table = this.model.table();
        var link = this.link;
        var docs = {};
        var value = '';
        var entire = table + '.' + key;//添加了前缀的完整key
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        key = args.shift() || '';
        obj = args.shift() || {};
        lifetime = args.shift() || 1800;

        if($.Util.isA(obj, me.model)) {
            Object.keys(columns).map(function(pro) {
                var field = columns[pro];
                docs[field] = obj[pro];
            });
        } else {
            //
            $.Log.warn('REDIS set', 'isnot a model:', $.Util.getClassname(me.model), obj);
        }
        lifetime = lifetime || Redis.TTL_MAX;

        // 连接
        this.connect(function() {
            value = $.Util.toString(docs);
            $.Log.info('REDIS set', entire, value, lifetime);
            link.set(entire, value, function(err, result) {
                $.Log.info('REDIS set_callback', entire, err, result);
                $.assert.equal(null, err);
                me.result = result;
                if(lifetime) {
                    $.Log.info('REDIS expire', entire, lifetime);
                    link.expire(entire, lifetime);
                }
                fn(result);
            });
        });
    };
    /**
     * 单个键中存储列表，对应于获取sets方法
     * @param key
     * @param objs
     * @param lifetime
     * @param fn
     */
    Redis.prototype.sets = function sets(key, objs, lifetime, fn) {
        var me = this;
        var columns = this.model.columns();
        var table = this.model.table();
        var link = this.link;
        var docs = [];
        var entire = table + '.' + key;//添加了前缀的完整key
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        key = args.shift() || '';
        objs = args.shift() || [];
        lifetime = args.shift() || Redis.TTL_MAX;

        if($.Util.isArray(objs)) {
            objs.map(function(obj) {
                if($.Util.isA(obj, me.model)) {
                    var doc = {};
                    Object.keys(columns).map(function(pro) {
                        var field = columns[pro];
                        doc[field] = obj[pro];
                    });
                    docs.push(doc);
                } else {
                    //
                    $.Log.warn('REDIS sets', 'isnot a model:', $.Util.getClassname(me.model), obj);
                }
            });
        }

        // 连接
        this.connect(function() {
            //此处是一个键里存储了多个对象的数组
            var value = $.Util.toString(docs);
            $.Log.info('REDIS sets', entire, value, lifetime);
            link.set(entire, value, function(err, result) {
                $.Log.info('REDIS sets_callback', entire, err, result);
                $.assert.equal(null, err);
                me.result = result;
                if(lifetime) {
                    $.Log.info('REDIS expire', entire, lifetime);
                    link.expire(entire, lifetime);
                }
                fn(result);
            });
        });
    };
    /**
     * 多个键中存储列表
     * @param key
     * @param objs
     * @param lifetime
     * @param fn
     */
    Redis.prototype.setList = function setList(keys, objs, lifetime, fn) {
        var me = this;
        //var columns = this.model.columns();
        //var table = this.model.table();
        var rets = [];
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        keys = args.shift() || [];
        objs = args.shift() || {};
        lifetime = args.shift() || Redis.TTL_MAX;
        
        if($.Util.isArray(keys)) {
            //多对存储
            var async = new $.util.Async();
            keys.map(function(key) {
                async.push(me.set, [key, objs[key], lifetime], function(err, ret) {
                    $.assert.equal(null, err);
                    rets.push(ret);
                });
            });
            async.exec(function() {
                me.result = rets;
                fn(rets);
            });
        } else {
            fn(false);
        }
    };
    /**
     * 单个获取
     * @param key
     * @param fn
     */
    Redis.prototype.get = function get(key, fn) {
        var me = this;
        var columns = this.model.columns();
        var table = this.model.table();
        var link = this.link;
        var entire = table + '.' + key;//添加了前缀的完整key
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        key = args.shift() || '';
        // 连接
        this.connect(function() {
            $.Log.info('REDIS get', entire);
            link.get(entire, function(err, result) {
                $.assert.equal(null, err);
                me.result = result;
                var item = null, obj = {};
                if(!$.Util.isEmpty(result)) {
                    result = $.Util.toJson(result);
                    Object.keys(columns).map(function(pro) {
                        obj[pro] = result[columns[pro]];
                    });
                    item = new me.model(obj);
                }
                fn(item);
            });
        });
    };
    /**
     * 获取单个键中列表，对应于存储sets方法
     * @param key
     * @param fn
     */
    Redis.prototype.gets = function gets(key, fn) {
        var me = this;
        var columns = this.model.columns();
        var table = this.model.table();
        var link = this.link;
        var entire = table + '.' + key;//添加了前缀的完整key
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        key = args.shift() || '';
        // 连接
        this.connect(function() {
            //此处是一个键里存储了多个对象的数组
            $.Log.info('REDIS gets', entire);
            link.get(entire, function(err, result) {
                $.assert.equal(null, err);
                var items = null;
                if(!$.Util.isEmpty(result)) {
                    result = $.Util.toJson(result);
                    if($.Util.isArray(result)) {
                        items = [];
                        result.map(function(r) {
                            var obj = {};
                            Object.keys(columns).map(function(pro) {
                                obj[pro] = r[columns[pro]];
                            });
                            items.push(new me.model(obj));
                        });
                    }
                }
                me.result = items;
                fn(items);
            });
        });
    };
    /**
     * 多个键获取列表
     * @param keys
     * @param fn
     */
    Redis.prototype.getList = function getList(keys, fn) {
        var me = this;
        //var columns = this.model.columns();
        //var table = this.model.table();
        var rets = [];
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        keys = args.shift() || [];

        if($.Util.isArray(keys)) {
            var async = new $.util.Async();
            keys.map(function(key) {
                async.push(me.get, [key], me, function(err, ret) {
                    $.assert.equal(null, err);
                    rets.push(ret);
                });
            });
            async.exec(function() {
                me.result = rets;
                fn(rets);
            });
        } else {
            fn(false);
        }
    };
    /**
     * 
     * @param key
     * @param fn
     */
    Redis.prototype.del = function del(key, fn) {
        var me = this;
        var link = this.link;
        var table = this.model.table();
        var entire = table + '.' + key;//添加了前缀的完整key
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        key = args.shift() || '';
        // 连接
        this.connect(function() {
            $.Log.info('REDIS del', entire);
            link.del.call(link, entire, function(err, result) {
                $.Log.info('REDIS del_callback', entire, err, result);
                if(err && $.Util.isString(err) && err != 'NOT_FOUND') {//忽略不存在的情况
                    err = RedisException.by(err);
                } else {
                    err = null;
                }
                if($.Util.isException(err)) {
                    fn(err);
                } else {
                    me.result = true;
                    fn(true);
                }
            });
        });
    };
    /**
     * 删除多个键
     * @param key
     * @param fn
     */
    Redis.prototype.delList = function delList(keys, fn) {
        var me = this;
        var rets = [];
        var args = [].slice.call(arguments, 0);

        fn = args.pop() || function() {};
        keys = args.shift() || [];

        if($.Util.isArray(keys)) {
            var async = new $.util.Async();
            keys.map(function(key) {
                async.push(me.del, [key], me, function(ret) {
                    rets.push(ret);
                });
            });
            async.exec(function() {
                me.result = rets;
                fn(rets);
            });
        } else {
            fn(false);
        }
    };
    /**
     * 内部类MemcacheException
     */
    function RedisException() {
        $.core.Exception.call(this, $.error.REDIS_ERROR.message, $.error.REDIS_ERROR.code);
    }

    $.Util.inherits(RedisException, $.core.Exception);

    RedisException.classname = 'core.Redis.RedisException';
    RedisException.by = function by(msg) {
        var e = new RedisException();
        if($.Util.isException(msg)) {
            e.message = e.message + ', ' + msg.message;//设置message
        } else {
            e.message = e.message + ', ' + msg;//设置message
        }
        return e;
    };
})();
