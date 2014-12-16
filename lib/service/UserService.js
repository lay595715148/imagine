
function UserService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.UserMongo');
    this.store.memcache = $.factory('store.memcache.UserMemcache');
}

$.Util.inherits(UserService, $.core.Service);

module.exports = exports = UserService;

UserService.classname = 'service.UserService';
UserService.prototype.read = function read(id, fn) {
    this.store.mongo.get(id, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isA(ret, $.model.User)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.readUser = function readUser(id, fn) {
    this.get(id, fn);
    return;
    var me = this;
    //先从memcache中读取
    me.mread(id, function(ret) {
        if(ret) {
            fn(ret);
        } else {
            //没有再从mongo中读取
            me.read(id, function(ret) {
                if(ret) {
                    fn(ret);
                    //缓存到memcache中
                    me.mcreate(id, ret, function(ret) {});
                } else {
                    fn(false);
                }
            });
        }
    });
};
/**
 * 
 * @param username
 * @param password md5前
 */
UserService.prototype.readByPassword = function readByPassword(username, password, fn) {
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
    this.store.mongo.getList(ids, function(ret) {
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
UserService.prototype.mread = function(id, fn) {
    if($.Util.isString(id) || $.Util.isNumber(id)) {
        var key = id;
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
UserService.prototype.mcreate = function(id, user, fn) {
    if(($.Util.isString(id) || $.Util.isNumber(id)) && $.Util.isA(user, $.model.User)) {
        var key = id;
        this.store.memcache.set(key, user, 0, function(ret) {
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
UserService.prototype.mremove = function(id, fn) {
    if($.Util.isString(id) || $.Util.isNumber(id)) {
        var key = id;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
