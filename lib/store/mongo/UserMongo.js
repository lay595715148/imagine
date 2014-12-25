/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserMongo() {
    $.store.MongoStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserMongo, $.store.MongoStore);

module.exports = exports = UserMongo;

(function() {
	UserMongo.classname = 'store.mongo.UserMongo';
})();
