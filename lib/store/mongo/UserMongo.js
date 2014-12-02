
function UserMongo() {
    $.store.MongoStore.apply(this, [$.model.User]);
    this.classname = 'store.mongo.UserMongo';
}

$.Util.inherits(UserMongo, $.store.MongoStore);

module.exports = exports = UserMongo;

