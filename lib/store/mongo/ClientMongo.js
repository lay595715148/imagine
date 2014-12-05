
function ClientMongo() {
    $.store.MongoStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientMongo, $.store.MongoStore);

module.exports = exports = ClientMongo;

ClientMongo.classname = 'store.mongo.ClientMongo';

