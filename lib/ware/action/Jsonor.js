/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Jsonor(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Template(req, res));
}

$.Util.inherits(Jsonor, $.core.Action);

module.exports = exports = Jsonor;

(function() {
	Jsonor.classname = 'ware.action.Jsonor';
	/*Jsonor.prototype.appendName = function appendName() {
	    if(this.name) {
	        this.response['name'] = this.name;
	    }
	};*/
})();
