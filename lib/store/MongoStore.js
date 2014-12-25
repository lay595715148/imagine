/* jshint eqeqeq: false */
/* global $ */
"use strict";

function MongoStore(model) {
    $.core.Mongo.apply(this, [model, $.get('servers.mongodb.master')]);
}

$.Util.inherits(MongoStore, $.core.Mongo);

module.exports = exports = MongoStore;

(function() {
	MongoStore.classname = 'store.MongoStore';
})();
