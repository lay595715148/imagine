/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2TokenMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.OAuth2Token]);
}

$.Util.inherits(OAuth2TokenMemcache, $.store.MemcacheStore);

module.exports = exports = OAuth2TokenMemcache;

(function() {
	OAuth2TokenMemcache.classname = 'store.memcache.OAuth2TokenMemcache';
})();
