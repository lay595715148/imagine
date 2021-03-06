/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2TokenRedis() {
    $.store.RedisStore.apply(this, [$.model.OAuth2Token]);
}

$.Util.inherits(OAuth2TokenRedis, $.store.RedisStore);

module.exports = exports = OAuth2TokenRedis;

(function() {
	OAuth2TokenRedis.classname = 'store.redis.OAuth2TokenRedis';
})();
