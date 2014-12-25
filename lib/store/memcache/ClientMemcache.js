/* jshint eqeqeq: false */
/* global $ */
"use strict";

function ClientMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientMemcache, $.store.MemcacheStore);

module.exports = exports = ClientMemcache;

(function() {
	ClientMemcache.classname = 'store.memcache.ClientMemcache';
})();
