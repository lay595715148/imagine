
function ClientRedis() {
    $.store.RedisStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientRedis, $.store.RedisStore);

module.exports = exports = ClientRedis;

ClientRedis.classname = 'store.redis.ClientRedis';

