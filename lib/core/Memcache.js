
function Memcache(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
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
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.set = function set(key, obj, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var docs = {};
    var value = '';

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
        $.Log.error('memcache set', 'isnot a model:', $.Util.getClassname(me.model), obj);
    }
    lifetime = lifetime || Memcache.TTL_MAX;

    // 连接
    this.connect(function() {
        value = $.Util.toString(docs);
        $.Log.info('memcache set', table + '.' + key, value, lifetime);
        link.set(table + '.' + key, value, function(err, result) {
            $.assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        }, lifetime);
    });
};
/**
 * 单个键中存储列表，对应于获取sets方法
 * @param database
 * @param fn
 */
Memcache.prototype.sets = function sets(key, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    //var link = this.link;
    var docs = [];

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
                $.Log.error('memcache sets', 'isnot a model:', $.Util.getClassname(me.model), obj);
            }
        });
    }

    // 连接
    this.connect(function() {
        //此处是一个键里存储了多个对象的数组
        var value = $.Util.toString(docs);
        $.Log.info('memcache sets', table + '.' + key, value, lifetime);
        link.set(table + '.' + key, value, function(err, result) {
            $.assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        }, lifetime);
    });
};
/**
 * 多对存储
 * @param key
 * @param objs
 * @param lifetime
 * @param fn
 */
Memcache.prototype.setList = function setList(key, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var rets = [];
    
    if($.Util.isArray(key)) {
        //多对存储
        var async = new $.util.Async();
        key.map(function(k) {
            async.push(me.set, [k, objs[k], lifetime], function(err, ret) {
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
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.get = function get(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    // 连接
    this.connect(function() {
        $.Log.info('memcache get', table + '.' + key);
        link.get(table + '.' + key, function(err, result) {
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
    // 连接
    this.connect(function() {
        //此处是一个键里存储了多个对象的数组
        $.Log.info('memcache gets', table + '.' + key);
        link.get(table + '.' + key, function(err, result) {
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
 * 
 * @param database
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
 * 
 * @param fn
 */
Memcache.prototype.del = function del(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    // 连接
    this.connect(function() {
        $.Log.info('memcache del ' + table + '.' + key);
        link['delete'].call(link, table + '.' + key, function(err, result) {
            $.assert.equal(null, err);
            if($.Util.isException(err)) {
                $.Util.isFunction(fn) && fn(err);
            } else {
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            }
        });
    });
};
/**
 * 
 * @param fn
 */
Memcache.prototype.dels = function dels(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    // 连接
    this.connect(function() {
        if($.Util.isArray(key)) {
            var async = new Async();
            key.map(function(k, i) {
                async.push(link['delete'], [table + '.' + k], link);
            });
            async.exec(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                var result = [];
                args.map(function(rets) {
                    var err = rets[0], ret = rets[1];
                    $.assert.equal(null, err);
                    result.push(ret);
                });
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        } else {
            link['delete'].call(link, table + '.' + key, function(err, result) {
                $.assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        }
    });
};
