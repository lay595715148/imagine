/* jshint eqeqeq: false */
/* global $ */
"use strict";

function TestRabbitmq() {
    $.store.RabbitmqStore.apply(this, [$.model.rabbitmq.Test]);
}

$.Util.inherits(TestRabbitmq, $.store.RabbitmqStore);

module.exports = exports = TestRabbitmq;

(function() {
	TestRabbitmq.classname = 'store.rabbitmq.TestRabbitmq';
})();
