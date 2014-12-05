
function Login() {
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Login, $.core.Jsonor);

module.exports = exports = Login;

Login.classname = 'json.user.Login';
/*
Login.prototype.before = function before(fn, rs) {
    var me = this, args = [].slice.call(arguments, 0);
    setTimeout(function() {
        fn && fn();
    }, 0);
    this.constructor.super_.prototype.before.apply(this, args);
};
*/
Login.prototype.onGet = function onGet(fn, rs) {
    //var me = this, args = [].slice.call(arguments, 0);
    $.Log.info('-----------------------  Login   -----------------------');
    this.correctResponse('get login');
    this._super_('onPost', fn, rs);
};
Login.prototype.onPost = function onPost(fn, rs) {
    //var me = this, args = [].slice.call(arguments, 0);
    $.Log.info('-----------------------  Login   -----------------------');
    //this.response['isok'] = true;
    //this.response['data'] = 'post login';
    this.correctResponse(['post login']);
    //this.incorrectResponse($.error.NO_OUTPUT);
    var store = new $.store.LoginStore();
    store.get();
    this._super_('onPost', fn, rs);
};
Login.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
