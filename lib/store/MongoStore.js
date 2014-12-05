
function MongoStore(model) {
    $.core.Mongo.apply(this, [model, $.get('servers.mongodb.master')]);
}

$.Util.inherits(MongoStore, $.core.Mongo);

module.exports = exports = MongoStore;

MongoStore.classname = 'store.MongoStore';
