/* jshint eqeqeq: false */
/* global $ */
"use strict";

function ClientMongo() {
    $.store.MongoStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientMongo, $.store.MongoStore);

module.exports = exports = ClientMongo;

(function() {
	ClientMongo.classname = 'store.mongo.ClientMongo';
})();
