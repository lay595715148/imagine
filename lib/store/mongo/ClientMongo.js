
function ClientMongo(model) {
    $.store.MongoStore.apply(this, [$.model.Client]);
    this.classname = 'store.mongo.ClientMongo';
}

$.Util.inherits(ClientMongo, $.store.MongoStore);

module.exports = exports = ClientMongo;

