
function Memcache(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
    $.core.Store.apply(this, arguments);
    this.classname = 'core.Memcache';
}

$.Util.inherits(Memcache, $.core.Store);

module.exports = exports = Memcache;

/**
 * @api private
 */
Memcache.prototype.init = function() {
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
Memcache.prototype.change = function(config, fn) {
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
Memcache.prototype.close = function(fn) {
    // 关闭
    if(!$.Util.isEmpty(this.link)) {
        this.link.close();
    }
    $.Util.isFunction(fn) && fn();
};
/**
 * @api private
 */
Memcache.prototype.connect = function(fn) {
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
Memcache.prototype.set = function(key, obj, lifetime, fn) {
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
    }

    // 连接
    this.connect(function() {
        value = $.Util.toString(docs);
        link.set(table + '.' + key, value, function(err, result) {
            $.assert.equal(null, err);
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
Memcache.prototype.sets = function(key, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var docs = [];
    var value = '';

    if($.Util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }

    if($.Util.isArray(objs)) {
        objs.map(function(obj, index) {
            if($.Util.isA(obj, me.model)) {
                var doc = {};
                Object.keys(columns).map(function(pro) {
                    var field = columns[pro];
                    doc[field] = obj[pro];
                });
                docs.push(doc);
            }
        });
    }

    // 连接
    this.connect(function() {
        if($.Util.isArray(key)) {
            var async = new Async();
            key.map(function(k, i) {
                async.push(link.set, [table + '.' + k, $.Util.toString(docs[i])], link, function() {}, [lifetime]);
            });
            async.exec(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                var result = [];
                args.map(function(rets) {
                    var err = rets[0], ret = rets[1];
                    assert.equal(null, err);
                    result.push(ret);
                });
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        } else {
            value = $.Util.toString(docs);
            link.set(table + '.' + key, value, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            }, lifetime);
        }
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.get = function(key, fn) {
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
Memcache.prototype.gets = function(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    // 连接
    this.connect(function() {
        if($.Util.isArray(key)) {
            var async = new Async();
            key.map(function(k, i) {
                async.push(link.get, [table + '.' + k], link);
            });
            async.exec(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                var items = [];
                args.map(function(rets) {
                    var err = rets[0], r = $.Util.toJson(rets[1]);
                    assert.equal(null, err);
                    var obj = {};
                    Object.keys(columns).map(function(pro) {
                        obj[pro] = r[columns[pro]];
                    });
                    items.push(new me.model(obj));
                });
                me.result = items;
                $.Util.isFunction(fn) && fn(items);
            });
        } else {
            link.get(table + '.' + key, function(err, result) {
                assert.equal(null, err);
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
        }
    });
};
/**
 * 
 * @param fn
 */
Memcache.prototype.del = function(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    // 连接
    this.connect(function() {
        link['delete'].call(link, table + '.' + key, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        });
    });
};
/**
 * 
 * @param fn
 */
Memcache.prototype.dels = function(key, fn) {
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
                    assert.equal(null, err);
                    result.push(ret);
                });
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        } else {
            link['delete'].call(link, table + '.' + key, function(err, result) {
                assert.equal(null, err);
                me.result = result;
                $.Util.isFunction(fn) && fn(result);
            });
        }
    });
};
