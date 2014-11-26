
function LoginStore() {
    $.store.MongoStore.apply(this, [$.model.LoginModel]);
    this.classname = 'store.LoginStore';
}

$.Util.inherits(LoginStore, $.store.MongoStore);

module.exports = exports = LoginStore;

