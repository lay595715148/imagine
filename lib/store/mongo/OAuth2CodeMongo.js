/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2CodeMongo() {
    $.store.MongoStore.apply(this, [$.model.OAuth2Code]);
}

$.Util.inherits(OAuth2CodeMongo, $.store.MongoStore);

module.exports = exports = OAuth2CodeMongo;

(function() {
	OAuth2CodeMongo.classname = 'store.mongo.OAuth2CodeMongo';
})();
