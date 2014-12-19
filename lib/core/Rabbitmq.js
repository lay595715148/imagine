
function Rabbitmq(model, config) {
    this.model = null;
    this.config = null;
    this.link = null;
    this.result = null;
    this._config = null;
    $.core.Store.apply(this, arguments);
}

$.Util.inherits(Rabbitmq, $.core.Store);

module.exports = exports = Rabbitmq;

Rabbitmq.classname = 'core.Rabbitmq';
/**
 * @api private
 * @abstract
 */
Rabbitmq.prototype.init = function init() {
    var config = $.Util.clone(this.config);
    var table = this.model.table();
    config.task = config.task ? config.task : table;
    config.channel = config.channel ? config.channel : table;
    this.link = $.rabbitmq_nodejs_client.create(config);
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
    if(!$.Util.isEmpty(this.link)) {
        this.link.end();
    }
    
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
    var link = this.link;
    if(this.link.connection) {
        console.log(1);
        $.Util.isFunction(fn) && fn();
    } else {
        console.log(2);
        link.on('connection', function() {
            // no arguments - we've connected
            $.Util.isFunction(fn) && fn();
            $.Log.info('we\'ve connected');
        });

        link.on('message', function() {
            // no arguments - connection has been closed
            $.Log.error('connection has been closed');
        });

        link.on('ack', function() {
            // no arguments - socket timed out
            $.Log.error('socket timed out');
        });
        link.on('close', function() {
            // no arguments - socket timed out
            $.Log.error('close');
        });

        link.on('error', function(e) {
            // there was an error - exception is 1st argument
            $.Log.error(e);
        });

        //$.Util.isFunction(fn) && fn();
        link.connect();
    }
};
Rabbitmq.prototype.pub = function pub() {
    
};
Rabbitmq.prototype.sub = function sub() {
    
};
Rabbitmq.prototype.test = function test(fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    me.connect(function() {
        //console.log(link);
        $.Util.isFunction(fn) && fn(true);
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Rabbitmq.prototype.set = function set(key, obj, lifetime, fn) {
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
        $.Log.warn('REDIS set', 'isnot a model:', $.Util.getClassname(me.model), obj);
    }
    lifetime = lifetime || Rabbitmq.TTL_MAX;

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
            $.Util.isFunction(fn) && fn(result);
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
Rabbitmq.prototype.sets = function sets(key, objs, lifetime, fn) {
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
    lifetime = lifetime || Rabbitmq.TTL_MAX;

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
        //var value = $.Util.toString(docs);
        $.Log.info('REDIS sets', entire, $.Util.toString(docs), lifetime);
        link.set(entire, value, function(err, result) {
            $.Log.info('REDIS sets_callback', entire, err, result);
            $.assert.equal(null, err);
            me.result = result;
            if(lifetime) {
                $.Log.info('REDIS expire', entire, lifetime);
                link.expire(entire, lifetime);
            }
            $.Util.isFunction(fn) && fn(result);
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
Rabbitmq.prototype.setList = function setList(keys, objs, lifetime, fn) {
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
Rabbitmq.prototype.get = function get(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var entire = table + '.' + key;//添加了前缀的完整key
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
            $.Util.isFunction(fn) && fn(item);
        });
    });
};
/**
 * 获取单个键中列表，对应于存储sets方法
 * @param key
 * @param fn
 */
Rabbitmq.prototype.gets = function gets(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var entire = table + '.' + key;//添加了前缀的完整key
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
            $.Util.isFunction(fn) && fn(items);
        });
    });
};
/**
 * 多个键获取列表
 * @param keys
 * @param fn
 */
Rabbitmq.prototype.getList = function getList(keys, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var rets = [];

    if($.Util.isArray(keys)) {
        var async = new Async();
        keys.map(function(key) {
            async.push(me.get, [key], me, function(err, ret) {
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
 * @param key
 * @param fn
 */
Rabbitmq.prototype.del = function del(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var entire = table + '.' + key;//添加了前缀的完整key
    // 连接
    this.connect(function() {
        $.Log.info('REDIS del', entire);
        link.del.call(link, entire, function(err, result) {
            $.Log.info('REDIS del_callback', entire, err, result);
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
Rabbitmq.prototype.delList = function delList(keys, fn) {
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
Rabbitmq.prototype.select = function select(query, fields, opts, fn) {
    this.search.apply(this, arguments);
};
Rabbitmq.prototype.selectOne = function select(query, fields, opts, fn) {
    this.searchOne.apply(this, arguments);
};
Rabbitmq.prototype.search = function search(query, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var columns = this.model.columns();
    var entire = table;
    var response, _query = link.createQuery();
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    query = args.length ? args.shift() || "*:*" : "*:*";
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};
    num = opts.num || 0;
    offset = opts.offset || 0;
    order = opts.order || '';
    
    query && _query.q(this.filter(query));
    num > 0 && _query.rows(num);
    offset >= 0 && _query.start(offset);
    order && _query.sort(order);
    me.connect(function() {
        $.Log.info('SOLR search', entire, query, num, offset, order);
        link.search(_query, function(err, result) {
            $.assert.equal(null, err);
            response = result.response;
            result = {};
            result.total = response.numFound;
            result.start = response.start;
            result.list = [];
            response.docs.map(function(r) {
                var obj = {};
                Object.keys(columns).map(function(pro) {
                    obj[pro] = r[columns[pro]];
                });
                result.list.push(new me.model(obj));
            });
            me.result = result;
            $.Util.isFunction(fn) && fn(result);
        });
    });
};
Rabbitmq.prototype.searchOne = function searchOne(query, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var columns = this.model.columns();
    var entire = table;
    var response, _query = link.createQuery();
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    query = args.length ? args.shift() || "*:*" : "*:*";
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};
    
    _query.q(this.filter(query)).start(0).rows(1);
    me.connect(function() {
        $.Log.info('SOLR searchOne', entire, query);
        link.search(_query, function(err, result) {
            $.assert.equal(null, err);
            response = result.response;
            result = response.docs.shift();
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
Rabbitmq.prototype.filter = function filter(query) {
    var table = this.model.table();
    var columns = this.model.columns();
    return query;
    //var _query = $.querystring.parse(query);
    /*Object.keys(columns).map(function(pro) {
        var field = columns[pro];
    });*/
};
/**
 * 内部类MemcacheException
 */
function RabbitmqException() {
    $.core.Exception.call(this, $.error.SOLR_ERROR.message, $.error.SOLR_ERROR.code);
}

$.Util.inherits(RabbitmqException, $.core.Exception);

RabbitmqException.classname = 'core.Rabbitmq.RabbitmqException';
