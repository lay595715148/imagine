
function Login() {
    $.core.Jsonor.apply(this, arguments);
    this.classname = 'json.user.Login';
}

$.Util.inherits(Login, $.core.Jsonor);

module.exports = exports = Login;
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
    $.Log.info('-----------------------  Login   ----------------');
    this.response['isok'] = true;
    this.response['data'] = 'get login';
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Login.prototype.onPost = function onPost(fn, rs) {
    //var me = this, args = [].slice.call(arguments, 0);
    $.Log.info('-----------------------  Login   ----------------');
    this.response['isok'] = true;
    this.response['data'] = 'post login';
    //var s = $.factory('service.UserService');
    //$.Log.debug(this.constructor.prototype);
    //(function() {me._super_.apply(me, args);})(args.unshift('onPost'));
    /*setTimeout(function() {
        args.unshift('onPost');
        me._super_.apply(me, args);
    }, 0);*/
    //$.Log.info($.Conf.get('servers.mongodb.master'));
    var store = new $.store.LoginStore();
    store.get();
    console.log($.moment().format('YYYY-MM-DD'));
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Login.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
