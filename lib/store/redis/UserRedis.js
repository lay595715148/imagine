/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserRedis() {
    $.store.RedisStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserRedis, $.store.RedisStore);

module.exports = exports = UserRedis;

(function() {
	UserRedis.classname = 'store.redis.UserRedis';
})();
