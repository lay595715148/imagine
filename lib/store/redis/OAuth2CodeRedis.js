
function OAuth2CodeRedis() {
    $.store.RedisStore.apply(this, [$.model.OAuth2Code]);
}

$.Util.inherits(OAuth2CodeRedis, $.store.RedisStore);

module.exports = exports = OAuth2CodeRedis;

OAuth2CodeRedis.classname = 'store.redis.OAuth2CodeRedis';
