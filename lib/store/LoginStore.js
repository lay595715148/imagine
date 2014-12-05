
function LoginStore() {
    $.store.MongoStore.apply(this, [$.model.LoginModel]);
}

$.Util.inherits(LoginStore, $.store.MongoStore);

module.exports = exports = LoginStore;

LoginStore.classname = 'store.LoginStore';
