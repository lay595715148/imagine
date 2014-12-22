
function UserRabbitmq() {
    $.store.RabbitmqStore.apply(this, [$.model.rabbitmq.User]);
}

$.Util.inherits(UserRabbitmq, $.store.RabbitmqStore);

module.exports = exports = UserRabbitmq;

UserRabbitmq.classname = 'store.rabbitmq.UserRabbitmq';
