/* jshint eqeqeq: false */
/* global $ */
"use strict";

function MemcacheStore(model) {
    $.core.Memcache.apply(this, [model, $.get('servers.memcache.master')]);
}

$.Util.inherits(MemcacheStore, $.core.Memcache);

module.exports = exports = MemcacheStore;

(function() {
	MemcacheStore.classname = 'store.MemcacheStore';
})();
