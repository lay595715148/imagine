/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserMemcache, $.store.MemcacheStore);

module.exports = exports = UserMemcache;

(function() {
	UserMemcache.classname = 'store.memcache.UserMemcache';
})();
