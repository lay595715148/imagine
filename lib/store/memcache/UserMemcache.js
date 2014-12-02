
function UserMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.User]);
    this.classname = 'store.memcache.UserMemcache';
}

$.Util.inherits(UserMemcache, $.store.MemcacheStore);

module.exports = exports = UserMemcache;

