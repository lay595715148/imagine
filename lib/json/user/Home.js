/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Home() {
    $.ware.action.Jsonor.apply(this, arguments);
}

$.Util.inherits(Home, $.ware.action.Jsonor);

module.exports = exports = Home;

(function() {
	Home.classname = 'json.user.Home';
	Home.prototype.onGet = function onGet(fn, rs) {
        this._super_(Home._super_.onGet, fn, rs);
	};
	Home.prototype.onPost = function onPost(fn, rs) {
        this._super_(Home._super_.onPost, fn, rs);
	};
	Home.prototype.noPermission = function noPermission() {
	    //this.res.redirect(200, '/');
	};
})();
