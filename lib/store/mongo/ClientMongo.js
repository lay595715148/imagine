
function ClientMongo() {
    $.store.MongoStore.apply(this, [$.model.Client]);
    this.classname = 'store.mongo.ClientMongo';
}

$.Util.inherits(ClientMongo, $.store.MongoStore);

module.exports = exports = ClientMongo;

