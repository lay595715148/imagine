
function Service() {
    this.store = {};
}

module.exports = exports = Service;

Service.classname = 'core.Service';
Service.prototype.get = function get(id, fn) {
    var me = this;
    if($.Util.isDefined(me.store.memcache)) {
        var key = id;
        me.store.memcache.get(key, function(ret) {
            if(!$.Util.isError(ret) && $.Util.isA(ret, $.core.Model)) {
                fn(ret);
            } else if($.Util.isDefeined(me.store.mongo)) {
                me.store.mongo.get(id, function(ret) {
                    if(!$.Util.isError(ret) && $.Util.isA(ret, $.core.Model)) {
                        fn(ret);
                        //缓存到memcache中
                        me.store.memcache.set(key, ret, 0, function() {});
                    } else {
                        fn(false);
                    }
                });
            } else {
                fn(false);
            }
        });
    } else if($.Util.isDefeined(me.store.mongo)) {
        me.store.mongo.get(id, function(ret) {
            if(!$.Util.isError(ret) && $.Util.isA(ret, $.model.User)) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
Service.prototype.getList = function getList(ids, opts, fn) {
    var me = this;
    var async = new $.util.Async();
    var rets = [];
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    ids = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};
    
    if($.Util.isArray(ids)) {
        ids.forEach(function(id) {
            async.push(me.get, [id], me, function(ret) {
                if(ret) {
                    rets.push(ret);
                }
            });
        });
        async.exec(function(rs) {
            fn(rets);
        });
    } else {
        fn(false);
    }
};
Service.prototype.add = function add(info, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    info = args.length ? args.shift() || {} : {};
    
    if($.Util.isDefeined(this.store.mongo)) {
        this.store.mongo.insert(info, function(ret) {
            if(ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
Service.prototype.addList = function addList(infos, opts, fn) {
    var me = this;
    var async = new $.util.Async();
    var rets = [];
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    infos = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    if($.Util.isArray(infos)) {
        infos.forEach(function(info) {
            async.push(me.add, [info], me, function(ret) {
                rets.push(ret);
            });
        });
        async.exec(function(rs) {
            fn(rets);
        });
    } else {
        fn(false);
    }
};
Service.prototype.del = function del(id, fn) {
    var me = this;
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    id = args.length ? args.shift() || {} : {};

    if($.Util.isDefeined(me.store.mongo)) {
        var key = id;
        me.store.mongo.remove(key, function(ret) {
            if(ret) {
                fn(ret);
                if($.Util.isDefined(me.store.memcache)) {
                    me.store.memcache.del(key, function(ret) {});
                }
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
Service.prototype.delList = function delList(ids, opts, fn) {
    var me = this;
    var async = new $.util.Async();
    var rets = [];
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    ids = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    if($.Util.isArray(ids)) {
        ids.forEach(function(id) {
            async.push(me.del, [id], me, function(ret) {
                rets.push(ret);
            });
        });
        async.exec(function(rs) {
            fn(rets);
        });
    } else {
        fn(false);
    }
};
Service.prototype.upd = function upd(id, info, fn) {
    var me = this;
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    id = args.length ? args.shift() || {} : {};

    if($.Util.isDefined(me.store.mongo)) {
        var key = id;
        me.store.mongo.upd(key, info, function(ret) {
            if(ret) {
                fn(ret);
                if($.Util.isDefined(me.store.memcache)) {
                    me.store.memcache.del(key, function(ret) {});
                }
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
/**
 * 
 * @param Array ids 如： [2001, 2002]
 * @param Object infos 如： {"2001":{"_id":2001, "name":"changed2001"},"2002":{"_id":2002, "name":"changed2002"}}
 */
Service.prototype.updList = function updList(ids, infos, opts, fn) {
    var me = this;
    var async = new $.util.Async();
    var rets = [];
    var args = [].slice.call(arguments, 0);
    fn = args.pop();
    ids = args.length ? args.shift() || [] : [];
    infos = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    if($.Util.isArray(ids)) {
        ids.forEach(function(id) {
            async.push(me.upd, [id, infos[id]], me, function(ret) {
                rets.push(ret);
            });
        });
        async.exec(function(rs) {
            fn(rets);
        });
    } else {
        fn(false);
    }
};
/**
 * 条件获取列表
 * @param selector
 * @param opts
 * @param fn
 */
Service.prototype.list = function list(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    if($.Util.isDefeined(this.store.mongo)) {
        this.store.mongo.select(selector, [], opts, function(rets) {
            if(!$.Util.isError(rets) && $.Util.isArray(rets)) {
                fn(rets);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
