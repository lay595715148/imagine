
function UserService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.UserMongo');
    this.store.memcache = $.factory('store.memcache.UserMemcache');
}

$.Util.inherits(UserService, $.core.Service);

module.exports = exports = UserService;

UserService.classname = 'service.UserService';
UserService.prototype.read = function(id, fn) {
    this.store.mongo.select({_id:id}, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isArray(ret) && !$.Util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param username
 * @param password md5前
 */
UserService.prototype.readByPassword = function(username, password, fn) {
    this.store.mongo.selectOne({name:username, pass:$.Util.MD5(password)}, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isA(ret, $.model.User)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 */
UserService.prototype.readByIds = function(ids, fn) {
    this.store.mongo.select({_id: {$in: ids}}, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isArray(ret)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.checkUser = function(username, password, fn) {
    this.readByPassword(username, password, fn);
};
UserService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(users) {
        if(!$.Util.isError(users) && $.Util.isArray(users)) {
            fn(users);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {User} user
 */
UserService.prototype.create = function(user, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    user = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(user, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.modify = function(id, params) {
    
};
UserService.prototype.mread = function(sessid, fn) {
    if($.Util.isString(sessid)) {
        var key = sessid;
        this.store.memcache.get(key, function(ret) {
            if($.Util.isA(ret, $.model.User)) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
UserService.prototype.mcreate = function(sessid, user, lifetime, fn) {
    if($.Util.isString(sessid) && $.Util.isA(user, $.model.User)) {
        var key = sessid;
        if($.Util.isFunction(lifetime)) {
            fn = lifetime;
            lifetime = 1800;
        }
        this.store.memcache.set(key, user, lifetime, function(ret) {
            if(ret === 'STORED') {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
UserService.prototype.mremove = function(sessid, fn) {
    if($.Util.isString(sessid)) {
        var key = sessid;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
