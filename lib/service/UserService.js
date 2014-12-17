
function UserService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.UserMongo');
    this.store.redis = $.factory('store.redis.UserRedis');
    //this.store.memcache = $.factory('store.memcache.UserMemcache');
}

$.Util.inherits(UserService, $.core.Service);

module.exports = exports = UserService;

UserService.classname = 'service.UserService';

/**
 * 读取多个用户
 * @param ids
 * @param fn
 */
UserService.prototype.readByIds = function(ids, fn) {
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
UserService.prototype.checkUser = function(username, password, fn) {
    this.seek({name:username, pass:$.Util.MD5(password)}, function(ret) {
        if(ret) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
