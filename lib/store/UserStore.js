
function UserStore() {
    $.core.Mongo.apply(this, [$.model.User, $.Conf.get('servers.mongodb.master')]);
    this.classname = 'store.UserStore';
}

$.Util.inherits(UserStore, $.core.Mongo);

module.exports = exports = UserStore;
