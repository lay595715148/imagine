/* jshint eqeqeq: false */
/* global $ */
"use strict";

function ScribeStore(model) {
    $.core.Scribe.apply(this, [model, $.get('servers.scribe.master')]);
}

$.Util.inherits(ScribeStore, $.core.Scribe);

module.exports = exports = ScribeStore;

(function() {
	ScribeStore.classname = 'store.ScribeStore';
})();
