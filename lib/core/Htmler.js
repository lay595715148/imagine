/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Htmler(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Jade(req, res));
}

$.Util.inherits(Htmler, $.core.Action);

module.exports = exports = Htmler;

(function() {
	Htmler.classname = 'core.Htmler';
})();
