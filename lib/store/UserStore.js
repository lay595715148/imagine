
function UserStore() {
    $.core.Mongo.apply(this, [$.model.User, $.get('servers.mongodb.master')]);
}

$.Util.inherits(UserStore, $.core.Mongo);

module.exports = exports = UserStore;

UserStore.classname = 'store.UserStore';
