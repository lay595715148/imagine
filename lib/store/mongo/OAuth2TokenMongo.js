/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2TokenMongo() {
    $.store.MongoStore.apply(this, [$.model.OAuth2Token]);
}

$.Util.inherits(OAuth2TokenMongo, $.store.MongoStore);

module.exports = exports = OAuth2TokenMongo;

(function() {
	OAuth2TokenMongo.classname = 'store.mongo.OAuth2TokenMongo';
})();
