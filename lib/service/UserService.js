/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.UserMongo');
    this.store.redis = $.factory('store.redis.UserRedis');
    this.store.solr = $.factory('store.solr.UserSolr');
    this.store.rabbitmq = $.factory('store.rabbitmq.UserRabbitmq');
    this.store.test = $.factory('store.rabbitmq.TestRabbitmq');
    //this.store.memcache = $.factory('store.memcache.UserMemcache');
}

$.Util.inherits(UserService, $.core.Service);

module.exports = exports = UserService;

(function() {
    UserService.classname = 'service.UserService';

    /**
     * 读取多个用户
     * @param ids
     * @param fn
     */
    UserService.prototype.readByIds = function readByIds(ids, fn) {
        this.getList(ids, function(ret) {
            if(ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    /**
     * 检测用户名和密码
     * @param username
     * @param password
     * @param fn
     */
    UserService.prototype.checkUser = function checkUser(username, password, fn) {
        this.seek({name:username, pass:$.Util.MD5(password)}, function(ret) {
            if(ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    UserService.prototype.searchUser = function searchUser(id, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        this.store.solr.searchOne("id:" + id, [], opts, function(ret) {
            if(!$.Util.isException(ret) && ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    UserService.prototype.userRabbitmq = function userRabbitmq(id, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        this.store.rabbitmq.test(function(ret) {
            if(!$.Util.isException(ret) && ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    UserService.prototype.testRabbitmq = function testRabbitmq(id, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        id = args.length ? args.shift() || {} : {};
        opts = args.length ? args.shift() || {} : {};
        this.store.test.test(function(ret) {
            if(!$.Util.isException(ret) && ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    UserService.prototype.sub = function sub(opts, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        opts = args.length ? args.shift() || {} : {};
        this.store.rabbitmq.sub(function(ret) {
            fn(ret);
        });
    };
    UserService.prototype.pub = function pub(opts, fn) {
        var args = [].slice.call(arguments, 0);
        fn = args.pop();
        opts = args.length ? args.shift() || {} : {};
        this.store.rabbitmq.pub(function(ret) {
            fn(ret);
        });
    };
})();
