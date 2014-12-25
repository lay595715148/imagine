/* jshint eqeqeq: false */
/* global $ */
"use strict";

function LoginModel(name, pass) {
    this.name = name;
    this.pass = pass;
}

$.Util.inherits(LoginModel, $.core.Model);

module.exports = exports = LoginModel;

(function() {
	LoginModel.classname = 'model.LoginModel';
})();
