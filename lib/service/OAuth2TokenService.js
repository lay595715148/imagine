
function OAuth2TokenService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.OAuth2TokenMongo');
    this.store.memcache = $.factory('store.memcache.OAuth2TokenMemcache');
}

$.Util.inherits(OAuth2TokenService, $.core.Service);

module.exports = exports = OAuth2TokenService;

OAuth2TokenService.classname = 'service.OAuth2TokenService';
/**
 * 
 * @param selector
 * @param opts
 * @param fn
 */
OAuth2TokenService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(ret) {
        if($.Util.isException(ret)) {
            fn(ret);
        } else if($.Util.isArray(ret)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.checkToken = function(token, fn) {
    this.mread(token, fn);
};
/**
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.revokeToken = function(token, fn) {
    this.mremove(token, fn);
};
/**
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
OAuth2TokenService.prototype.create = function(token, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    token = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(token, function(ret) {
        if($.Util.isException(ret)) {
            fn(ret);
        } else if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
OAuth2TokenService.prototype.gen = function(clientId, userid, use_refresh_token, fn) {
    //var token = $.Uti.MD5($.node_uuid.v4());
    //var rtoken = $.Uti.MD5($.node_uuid.v4());
    var expires = ($.get('oauth2.access_token_lifetime') || 1800) + $.Util.time();
    var confusion = $.util.Encryption.confusion();
    var info = [confusion, userid, expires];//, clientId
    var token = $.util.Encryption.encrypt(JSON.stringify(info));//$.util.Base64.encode()
    var t = new $.model.OAuth2Token();
    var async = new $.util.Async();
    
    t.setToken(token);
    t.setExpires(expires);
    t.setClientId(clientId);
    t.setUserid(userid);
    t.setType(1);
    
    async.push(this.mcreate, [t], this, function(ret) {
        if(!use_refresh_token || !ret) {
            if($.Util.isException(ret)) {
                fn(ret);
            } else if(ret) {
                fn(t);
            } else {
                fn(false);
            }
            return false;//下一个任务不执行
        }
    });
    if(use_refresh_token) {
        var rexpires = ($.get('oauth2.refresh_token_lifetime') || 86400) + $.Util.time();
        var rconfusion = $.util.Encryption.confusion();
        var rinfo = [rconfusion, userid, rexpires, 1];//, clientId
        var rtoken = $.util.Encryption.encrypt(JSON.stringify(rinfo));//$.util.Base64.encode()
        var rt = new $.model.OAuth2Token();
        rt.setToken(rtoken);
        rt.setExpires(rexpires);
        rt.setClientId(clientId);
        rt.setUserid(userid);
        rt.setType(2);
        async.push(this.mcreate, [rt], this, function(ret) {
            if($.Util.isException(ret)) {
                fn(ret);
            } else if(ret) {
                fn([t, rt]);
            } else {
                fn(false);
            }
        });
    }
    async.exec();
};
/**
 * 删除
 * @param token
 * @param fn
 */
OAuth2TokenService.prototype.remove = function remove(token, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    token = args.length ? args.shift() || {} : {};
    
    this.store.mongo.remove(token, function(ret) {
        if($.Util.isException(ret)) {
            fn(ret);
        } else if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.mread = function mread(token, fn) {
    if($.Util.isString(token)) {
        var key = token;
        this.store.memcache.get(key, function(ret) {
            if($.Util.isException(ret)) {
                fn(ret);
            } else if($.Util.isA(ret, $.model.OAuth2Token)) {
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
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
OAuth2TokenService.prototype.mcreate = function mcreate(token, fn) {
    if($.Util.isA(token, $.model.OAuth2Token)) {
        var me = this;
        var key = token.token;
        var lifetime = token.expires - $.Util.time();
        this.store.memcache.set(key, token, lifetime, function(ret) {
            if($.Util.isException(ret)) {
                fn(ret);
            } else if(ret === 'STORED') {
                me.create(token, function(ret) {
                });
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
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.mremove = function mremove(token, fn) {
    var me = this;
    if($.Util.isString(token)) {
        var key = token;
        this.store.memcache.del(key, function(ret) {
            if($.Util.isException(ret)) {
                fn(ret);
            } else if(ret === 'DELETED') {
                fn(true);
                me.remove(token, function(ret) {
                });
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
