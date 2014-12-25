/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2CodeMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.OAuth2Code]);
}

$.Util.inherits(OAuth2CodeMemcache, $.store.MemcacheStore);

module.exports = exports = OAuth2CodeMemcache;

(function() {
	OAuth2CodeMemcache.classname = 'store.memcache.OAuth2CodeMemcache';
})();
