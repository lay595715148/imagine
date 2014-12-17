
function RedisStore(model) {
    $.core.Redis.apply(this, [model, $.get('servers.redis.master')]);
}

$.Util.inherits(RedisStore, $.core.Redis);

module.exports = exports = RedisStore;

RedisStore.classname = 'store.RedisStore';
