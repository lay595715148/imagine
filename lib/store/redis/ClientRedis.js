/* jshint eqeqeq: false */
/* global $ */
"use strict";

function ClientRedis() {
    $.store.RedisStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientRedis, $.store.RedisStore);

module.exports = exports = ClientRedis;

(function() {
	ClientRedis.classname = 'store.redis.ClientRedis';
})();
