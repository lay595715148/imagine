
function Memcache(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Memcache, $.core.Store);

module.exports = exports = Memcache;

Memcache.classname = 'core.Memcache';
Memcache.TTL_MIN = 60;//1 minute and min
Memcache.TTL_HOUR = 3600;//1 hour
Memcache.TTL_DAY = 86400;//1 day
Memcache.TTL_MAX = 2592000;//30 days and max
/**
 * @api private
 */
Memcache.prototype.init = function init() {
    var config = this.config;
    this.link = new $.memcache.Client(config.port, config.host);
    // always connect lazily
};

/**
 * 连接后可重新选择数据库
 * 
 * @param database
 * @sync
 */
Memcache.prototype.change = function change(config, fn) {
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

    this.link = new MemcacheClient(config.port, config.host);

    $.Util.isFunction(fn) && fn(true);
    return true;
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.close = function close(fn) {
    // 关闭
    if(!$.Util.isEmpty(this.link)) {
        this.link.close();
    }
    $.Util.isFunction(fn) && fn();
};
/**
 * @api private
 */
Memcache.prototype.connect = function connect(fn) {
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
            $.Log.error('connection has been closed');
        });

        link.on('timeout', function() {
            // no arguments - socket timed out
            $.Log.error('socket timed out');
        });

        link.on('error', function(e) {
            // there was an error - exception is 1st argument
            $.Log.error(e);
        });

        link.connect();
    }
};
/**
 * 单个键中存储
 * @param key
 * @param obj
 * @param lifetime
 * @param fn
 */
Memcache.prototype.set = function set(key, obj, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var docs = {};
    var value = '';
    var entire = table + '.' + key;//添加了前缀的完整key

    if($.Util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }

    if($.Util.isA(obj, me.model)) {
        Object.keys(columns).map(function(pro) {
            var field = columns[pro];
            docs[field] = obj[pro];
        });
    } else {
        //
        $.Log.warn('MEMCACHE set', 'isnot a model:', $.Util.getClassname(me.model), obj);
    }
    lifetime = lifetime || Memcache.TTL_MAX;

    // 连接
    this.connect(function() {
        value = $.Util.toString(docs);
        $.Log.info('MEMCACHE set', entire, value, lifetime);
        link.set(entire, value, function(err, result) {
            $.Log.info('MEMCACHE set_callback', entire, err, result);
            $.assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        }, lifetime);
    });
};
/**
 * 单个键中存储列表，对应于获取gets方法
 * @param key
 * @param objs
 * @param lifetime
 * @param fn
 */
Memcache.prototype.sets = function sets(key, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    //var link = this.link;
    var docs = [];
    var entire = table + '.' + key;//添加了前缀的完整key

    if($.Util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }
    lifetime = lifetime || Memcache.TTL_MAX;

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
                $.Log.warn('MEMCACHE sets', 'isnot a model:', $.Util.getClassname(me.model), obj);
            }
        });
    }

    // 连接
    this.connect(function() {
        //此处是一个键里存储了多个对象的数组
        var value = $.Util.toString(docs);
        $.Log.info('MEMCACHE sets', entire, value, lifetime);
        link.set(entire, value, function(err, result) {
            $.Log.info('MEMCACHE sets_callback', entire, err, result);
            $.assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        }, lifetime);
    });
};
/**
 * 多对存储
 * @param keys
 * @param objs
 * @param lifetime
 * @param fn
 */
Memcache.prototype.setList = function setList(keys, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var rets = [];
    
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
            $.Util.isFunction(fn) && fn(rets);
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
Memcache.prototype.get = function get(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var entire = table + '.' + key;//添加了前缀的完整key
    // 连接
    this.connect(function() {
        $.Log.info('MEMCACHE get', entire);
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
            $.Util.isFunction(fn) && fn(item);
        });
    });
};
/**
 * 获取单个键中列表，对应于存储sets方法
 * @param database
 * @param fn
 */
Memcache.prototype.gets = function gets(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var entire = table + '.' + key;//添加了前缀的完整key
    // 连接
    this.connect(function() {
        //此处是一个键里存储了多个对象的数组
        $.Log.info('MEMCACHE gets', entire);
        link.get(entire, function(err, result) {
            $.assert.equal(null, err);
            var items = [];
            if(!$.Util.isEmpty(result)) {
                result = $.Util.toJson(result);
                if($.Util.isArray(result)) {
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
            $.Util.isFunction(fn) && fn(items);
        });
    });
};
/**
 * 多个键获取列表
 * @param keys
 * @param fn
 */
Memcache.prototype.getList = function getList(keys, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var rets = [];

    if($.Util.isArray(key)) {
        var async = new Async();
        key.map(function(k, i) {
            async.push(me.get, [k], me, function(err, ret) {
                $.assert.equal(null, err);
                rets.push(ret);
            });
        });
        async.exec(function() {
            me.result = rets;
            $.Util.isFunction(fn) && fn(rets);
        });
    } else {
        fn(false);
    }
};
/**
 * 单个键删除
 * @param key
 * @param fn
 */
Memcache.prototype.del = function del(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var entire = table + '.' + key;//添加了前缀的完整key
    // 连接
    this.connect(function() {
        $.Log.info('MEMCACHE del', entire);
        link['delete'].call(link, entire, function(err, result) {
            $.Log.info('MEMCACHE del_callback', entire, err, result);
            if(err && $.Util.isString(err) && err != 'NOT_FOUND') {//忽略不存在的情况
                err = MemcacheException.by(err);
            } else {
                err = null;
            }
            if($.Util.isException(err)) {
                $.Util.isFunction(fn) && fn(err);
            } else {
                me.result = true;
                $.Util.isFunction(fn) && fn(true);
            }
        });
    });
};
/**
 * 删除多个键
 * @param key
 * @param fn
 */
Memcache.prototype.delList = function delList(keys, fn) {
    var me = this;
    var rets = [];

    if($.Util.isArray(keys)) {
        var async = new Async();
        keys.map(function(key) {
            async.push(me.del, [key], me, function(ret) {
                rets.push(ret);
            });
        });
        async.exec(function() {
            me.result = rets;
            $.Util.isFunction(fn) && fn(rets);
        });
    } else {
        fn(false);
    }
};
/**
 * 内部类MemcacheException
 */
function MemcacheException() {
    $.core.Exception.call(this, $.error.MEMCACHE_ERROR.message, $.error.MEMCACHE_ERROR.code);
}

$.Util.inherits(MemcacheException, $.core.Exception);

MemcacheException.classname = 'core.Memcache.MemcacheException';
MemcacheException.NOT_FOUND = 'NOT_FOUND';
MemcacheException.by = function by(msg) {
    var e = new MemcacheException();
    e.message = e.message + ', ' + msg;//设置message
    return e;
    //不使用子类，
    /*switch(msg) {
        case MemcacheException.NOT_FOUND:
            e = new NotFoundException();
            break;
        default:
            e = new MemcacheException();
            e.message = msg;//设置message
            break;
    }
    return e;*/
};
/**
 * 内部类NotFoundException
 */
function MemcacheNotFoundException() {
    $.core.Exception.call(this, $.error.MEMCACHE_NOT_FOUND.message, $.error.MEMCACHE_NOT_FOUND.code);
}
$.Util.inherits(MemcacheNotFoundException, MemcacheException);

MemcacheNotFoundException.classname = 'core.Memcache.MemcacheNotFoundException';
