/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Event() {
}

$.Util.inherits(Event, require('events').EventEmitter);

module.exports = exports = Event;

(function() {
	Event.classname = 'core.Event';
})();
