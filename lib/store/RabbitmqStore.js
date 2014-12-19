
function RabbitmqStore(model) {
    $.core.Rabbitmq.apply(this, [model, $.get('servers.rabbitmq.master')]);
}

$.Util.inherits(RabbitmqStore, $.core.Rabbitmq);

module.exports = exports = RabbitmqStore;

RabbitmqStore.classname = 'store.RabbitmqStore';
