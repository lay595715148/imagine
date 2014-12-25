/* jshint eqeqeq: false */
/* global $ */
"use strict";

function LoginStore() {
    $.store.MongoStore.apply(this, [$.model.LoginModel]);
}

$.Util.inherits(LoginStore, $.store.MongoStore);

module.exports = exports = LoginStore;

(function() {
	LoginStore.classname = 'store.LoginStore';
})();
