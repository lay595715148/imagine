
function MongoStore(model) {
    $.core.Mongo.apply(this, [model, $.get('servers.mongodb.master')]);
    this.classname = 'store.MongoStore';
}

$.Util.inherits(MongoStore, $.core.Mongo);

module.exports = exports = MongoStore;

