
function UserRedis() {
    $.store.RedisStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserRedis, $.store.RedisStore);

module.exports = exports = UserRedis;

UserRedis.classname = 'store.redis.UserRedis';

