
function LoginModel(name, pass) {
    this.name = name;
    this.pass = pass;
    this.classname = 'model.LoginModel';
}

$.Util.inherits(LoginModel, $.core.Model);

module.exports = exports = LoginModel;
