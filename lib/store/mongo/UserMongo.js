
function UserMongo() {
    $.store.MongoStore.apply(this, [$.model.User]);
}

$.Util.inherits(UserMongo, $.store.MongoStore);

module.exports = exports = UserMongo;

UserMongo.classname = 'store.mongo.UserMongo';

