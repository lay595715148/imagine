
function OAuth2CodeService() {
    $.core.Service.apply(this, arguments);
    this.classname = 'service.UserService';
    this.store.mongo = $.factory('store.mongo.OAuth2CodeMongo');
    this.store.memcache = $.factory('store.memcache.OAuth2CodeMemcache');
}

$.Util.inherits(OAuth2CodeService, $.core.Service);

module.exports = exports = OAuth2CodeService;

/**
 * 
 * @param selector
 * @param opts
 * @param fn
 */
OAuth2CodeService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(codes) {
        if(!$.Util.isError(codes) && $.Util.isArray(codes)) {
            fn(codes);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param code
 * @param fn
 */
OAuth2CodeService.prototype.checkCode = function(code, fn) {
    this.mread(code, fn);
};
/**
 * 
 * @param {OAuth2Code} code
 * @param fn
 */
OAuth2CodeService.prototype.create = function(code, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    code = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(code, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
OAuth2CodeService.prototype.gen = function(clientId, userid, redirectURI, fn) {
    var code = $.Util.MD5($.node_uuid.v4());
    var expires = ( $.get('oauth2.code_lifetime') || 100 ) + $.Util.time();
    var c = new $.model.OAuth2Code();
    
    c.setCode(code);
    c.setExpires(expires);
    c.setClientId(clientId);
    c.setUserid(userid);
    c.setRedirectURI(redirectURI);
    
    this.mcreate(c, function(ret) {
        if(ret) {
            fn(c);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {String} code
 * @param fn
 */
OAuth2CodeService.prototype.mread = function(code, fn) {
    if($.Util.isString(code)) {
        var key = code;
        this.store.memcache.get(key, function(ret) {
            if($.Util.isA(ret, $.model.OAuth2Code)) {
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
 * @param {OAuth2Code} code
 * @param fn
 */
OAuth2CodeService.prototype.mcreate = function(code, fn) {
    if($.Util.isA(code, $.model.OAuth2Code)) {
        var me = this;
        var key = code.code;
        var lifetime = code.expires - $.Util.time();
        this.store.memcache.set(key, code, lifetime, function(ret) {
            if(ret === 'STORED') {
                fn(ret);
                me.create(code, function(ret) {
                    $.Log.info('create code', ret, $.Util.toString(code));
                });
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
 * @param {String} code
 * @param fn
 */
OAuth2CodeService.prototype.mremove = function(code, fn) {
    if($.Util.isString(code)) {
        var key = code;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
