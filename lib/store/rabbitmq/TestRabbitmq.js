
function TestRabbitmq() {
    $.store.RabbitmqStore.apply(this, [$.model.rabbitmq.Test]);
}

$.Util.inherits(TestRabbitmq, $.store.RabbitmqStore);

module.exports = exports = TestRabbitmq;

TestRabbitmq.classname = 'store.rabbitmq.TestRabbitmq';
