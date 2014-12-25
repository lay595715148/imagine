/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Service() {
    this.store = {};
    this.error = [];
}

module.exports = exports = Service;

Service.classname = 'core.Service';

(function() {
    Service.prototype.getException = function getException() {
        return this.error;
    };
    Service.prototype.setException = function getException(err) {
        if($.Util.isException(err)) {
            this.error.push(err);
        }
    };
    /**
     * 在缓存中获取一条数据，如果没有则再从数据库中获取
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.get = function get(id, opts, fn) {
        var me = this;
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        //从缓存中读取
        me.find(id, opts, function(ret) {
            if(ret) {//有
                fn(ret);
            } else {//没有
                //从数据库中读取
                me.read(id, opts, function(ret) {
                    fn(ret);//回调结果
                    if(ret) {
                        //有数据则加入缓存
                        me.inrt(id, ret, 0, function() {});
                    }
                });
            }
        });
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
                async.push(me.get, [id, opts], me, function(ret) {
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
     * 只在数据库中增加一条数据。
     * 添加数据时，只对数据库操作，缓存设置总是在获取时没有的情况下再添加。
     * @param info
     * @param fn
     */
    Service.prototype.add = function add(info, fn) {
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        info = args.length ? args.shift() || {} : {};
        
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.insert(info, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.insert(info, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在数据库中增加多条数据
     * @param infos
     * @param opts
     * @param fn
     */
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
    /**
     * 删除
     * @param id
     * @param fn
     */
    Service.prototype.del = function del(id, fn) {
        var me = this;
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};
        //先从数据库中删除
        me.dele(id, function(ret) {
            fn(ret);//回调结果
            if(ret) {//成功则从缓存中删除
                me.cler(id, function() {});//不检测在缓存中的删除结果
            }
        });
    };
    /**
     * 删除多个
     * @param ids
     * @param opts
     * @param fn
     */
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
    /**
     * 更新，同时自动删除缓存数据
     * @param id
     * @param info
     * @param fn
     */
    Service.prototype.upd = function upd(id, info, opts, fn) {
        var me = this;
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};
        info = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};

        //先从数据库中更新
        me.rnew(id, info, opts, function(ret) {
            fn(ret);//回调结果
            if(ret) {//成功则从缓存中删除
                me.cler(id, function() {});//不检测在缓存中的删除结果
            }
        });
    };
    /**
     * 更新多个，同时自动删除缓存数据
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
                async.push(me.upd, [id, infos[id], opts], me, function(ret) {
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
     * 只在数据库中获取一条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.read = function read(id, opts, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.get(id, function(ret) {
                if(!$.Util.isException(ret) && $.Util.isA(ret, $.core.Model)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.get(id, function(ret) {
                if(!$.Util.isException(ret) && $.Util.isA(ret, $.core.Model)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在数据库中获取多条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.readList = function readList(ids, opts, fn) {
        var me = this;
        var async = new $.util.Async();
        var rets = [];
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        ids = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};
        
        if($.Util.isArray(ids)) {
            ids.forEach(function(id) {
                async.push(me.read, [id, opts], me, function(ret) {
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
     * 只在数据库中更新一条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.rnew = function rnew(id, info, opts, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        info = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.upd(id, info, opts, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.upd(id, info, opts, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在数据库中更新多条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.rnewList = function rnewList(ids, infos, opts, fn) {
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
                async.push(me.rnew, [id, infos[id], opts], me, function(ret) {
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
     * 只在数据库中删除一条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.dele = function dele(id, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.del(id, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.del(id, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在数据库中删除多条数据
     * @param ids
     * @param opts
     * @param fn
     */
    Service.prototype.deleList = function deleList(ids, opts, fn) {
        var me = this;
        var async = new $.util.Async();
        var rets = [];
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        ids = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};

        if($.Util.isArray(ids)) {
            ids.forEach(function(id) {
                async.push(me.dele, [id], me, function(ret) {
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
     * 只在缓存中获取一条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.find = function find(id, opts, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        opts = args.length ? args.shift() || {} : {};
        if($.Util.isDefined(this.store.memcache)) {
            this.store.memcache.get(id, function(ret) {
                if(!$.Util.isError(ret) && $.Util.isA(ret, $.core.Model)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.redis)) {
            this.store.redis.get(id, function(ret) {
                if(!$.Util.isError(ret) && $.Util.isA(ret, $.core.Model)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在缓存中获取多条数据
     * @param Array ids
     * @param Function fn
     */
    Service.prototype.findList = function findList(ids, opts, fn) {
        var me = this;
        var async = new $.util.Async();
        var rets = [];
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        ids = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};
        
        if($.Util.isArray(ids)) {
            ids.forEach(function(id) {
                async.push(me.find, [id, opts], me, function(ret) {
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
     * 只在缓存中添加一条数据
     * @param Integer id
     * @param Object info
     * @param Integer lifetime
     * @param Function fn
     */
    Service.prototype.inrt = function inrt(id, info, lifetime, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || 0 : 0;
        info = args.length ? args.shift() || {} : {};
        lifetime = args.length ? args.shift() || 0 : 0;
        if($.Util.isDefined(this.store.memcache)) {
            this.store.memcache.set(id, info, lifetime, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.redis)) {
            this.store.redis.set(id, info, lifetime, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在缓存中添加多条数据
     * @param infos
     * @param opts
     * @param fn
     */
    Service.prototype.inrtList = function inrtList(ids, infos, lifetime, opts, fn) {
        var me = this;
        var async = new $.util.Async();
        var rets = [];
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        ids = args.length ? args.shift() || [] : [];
        infos = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};

        if($.Util.isArray(ids)) {
            ids.forEach(function(id) {
                async.push(me.inrt, [id, infos[id], lifetime], me, function(ret) {
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
     * 只在缓存中删除一条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.cler = function cler(id, fn) {
        var me = this;
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};

        if($.Util.isDefined(me.store.memcache)) {
            me.store.memcache.del(id, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(me.store.redis)) {
            me.store.redis.del(id, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 只在缓存中删除多条数据
     * @param Integer id
     * @param Function fn
     */
    Service.prototype.clerList = function clerList(ids, opts, fn) {
        var me = this;
        var async = new $.util.Async();
        var rets = [];
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        ids = args.length ? args.shift() || [] : [];
        opts = args.length ? args.shift() || {} : {};

        if($.Util.isArray(ids)) {
            ids.forEach(function(id) {
                async.push(me.cler, [id], me, function(ret) {
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
     * 在数据库中条件获取一条
     * @param selector
     * @param opts
     * @param fn
     */
    Service.prototype.seek = function seek(selector, opts, fn) {
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.selectOne(selector, [], opts, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.selectOne(selector, [], opts, function(ret) {
                if(!$.Util.isException(ret) && ret) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 在数据库中条件获取列表
     * @param selector
     * @param opts
     * @param fn
     */
    Service.prototype.list = function list(selector, opts, fn) {
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.select(selector, [], opts, function(rets) {
                if(!$.Util.isException(rets) && $.Util.isArray(rets)) {
                    fn(rets);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.select(selector, [], opts, function(rets) {
                if(!$.Util.isException(rets) && $.Util.isArray(rets)) {
                    fn(rets);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
    /**
     * 在数据库中条件记数
     * @param selector
     * @param opts
     * @param fn
     */
    Service.prototype.count = function count(selector, opts, fn) {
        var args = Array.prototype.slice.call(arguments, 0);
        fn = args.pop();
        selector = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        
        if($.Util.isDefined(this.store.mongo)) {
            this.store.mongo.count(selector, opts, function(ret) {
                if(!$.Util.isException(ret) && $.Util.isNumber(ret)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else if($.Util.isDefined(this.store.mysql)) {
            this.store.mysql.count(selector, opts, function(ret) {
                if(!$.Util.isException(ret) && $.Util.isNumber(ret)) {
                    fn(ret);
                } else {
                    fn(false);
                }
            });
        } else {
            fn(false);
        }
    };
})();
