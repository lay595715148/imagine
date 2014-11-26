
function Redis(model, config) {
    this.model = null;
    this.config = null;
    this.link = null;
    this.result = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
    this.classname = 'core.Redis';
}

$.Util.inherits(Redis, $.core.Store);

module.exports = exports = Redis;

Redis.commands = ["get", "set", "setnx", "setex", "append", "strlen", "del",
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
Redis.commands.forEach(function (fullCommand) {
    var command = fullCommand.split(' ')[0];

    Redis.prototype[command] = function (args, callback) {
        /*var me = this;
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
        });*/
        if ($.Util.isArray(args) && $.Util.isFunction(callback)) {
            args.push(callback);
            return this.link[command].apply(this.link, args);
        } else {
            return this.link[command].apply(this.link, [].slice.call(arguments, 0));
        }
    };
    Redis.prototype[command.toUpperCase()] = RedisClient.prototype[command];
});

/**
 * @api private
 * @abstract
 */
Redis.prototype.init = function init() {
    var config = this.config;
    this.link = redis.createClient(config.port, config.host);
    // always connect lazily
};
/**
 * 连接后可重新选择数据库
 * 
 * @param database
 * @sync
 */
Redis.prototype.change = function change(config, fn) {
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
    if(!$.Util.isEmpty(this.link)) {
        this.link.close();
    }

    this.link = new Client(config.port, config.host);

    $.Util.isFunction(fn) && fn(true);
    return true;
};
/**
 * 
 * @param database
 * @param fn
 */
Redis.prototype.close = function close(fn) {
    // 关闭
    if(!$.Util.isEmpty(this.link)) {
        this.link.close();
    }
    $.Util.isFunction(fn) && fn();
};
/**
 * @api private
 */
Redis.prototype.connect = function connect(fn) {
    var link = this.link;
    if(!$.Util.isEmpty(this.link.conn)) {
        $.Util.isFunction(fn) && fn();
    } else {
        link.on('connect', function() {
            // no arguments - we've connected
            fn();
        });

        link.on('close', function() {
            // no arguments - connection has been closed
        });

        link.on('timeout', function() {
            // no arguments - socket timed out
        });

        link.on('error', function(e) {
            // there was an error - exception is 1st argument
            $logger.error(e);
        });

        link.connect();
    }
};
/**
 * 
 * @param database
 * @param fn
 */
Redis.prototype.set = function set(key, obj, fn, lifetime) {
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
};
/**
 * 
 * @param database
 * @param fn
 */
Redis.prototype.get = function get(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    // 连接
    this.connect(function() {
        link.get(table + '.' + key, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var item = null, obj = {};
            if(!$.Util.isEmpty(result)) {
                result = $.Util.toJson(result);
                Object.keys(columns).map(function(pro) {
                    obj[pro] = result[columns[pro]];
                });
                item = new me.model(obj);
            }
            $.Util.isFunction(fn) && fn(item);
        });
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Redis.prototype.del = function del(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    // 连接
    this.connect(function() {
        link['delete'].call(link, table + '.' + key, function(err, result) {
            // assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        });
    });
};
