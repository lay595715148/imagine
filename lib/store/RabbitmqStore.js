/* jshint eqeqeq: false */
/* global $ */
"use strict";

function RabbitmqStore(model) {
    $.core.Rabbitmq.apply(this, [model, $.get('servers.rabbitmq.master')]);
}

$.Util.inherits(RabbitmqStore, $.core.Rabbitmq);

module.exports = exports = RabbitmqStore;

(function() {
	RabbitmqStore.classname = 'store.RabbitmqStore';
})();
