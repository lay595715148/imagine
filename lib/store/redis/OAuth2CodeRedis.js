/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2CodeRedis() {
    $.store.RedisStore.apply(this, [$.model.OAuth2Code]);
}

$.Util.inherits(OAuth2CodeRedis, $.store.RedisStore);

module.exports = exports = OAuth2CodeRedis;

(function() {
	OAuth2CodeRedis.classname = 'store.redis.OAuth2CodeRedis';
})();
