
function UserMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserMemcache, $.store.MemcacheStore);

module.exports = exports = UserMemcache;

UserMemcache.classname = 'store.memcache.UserMemcache';

