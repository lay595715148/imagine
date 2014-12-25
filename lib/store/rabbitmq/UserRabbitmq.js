/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserRabbitmq() {
    $.store.RabbitmqStore.apply(this, [$.model.rabbitmq.User]);
}

$.Util.inherits(UserRabbitmq, $.store.RabbitmqStore);

module.exports = exports = UserRabbitmq;

(function() {
	UserRabbitmq.classname = 'store.rabbitmq.UserRabbitmq';
})();
