
function Login() {
    this.uService = null;
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Login, $.core.Jsonor);

module.exports = exports = Login;

Login.classname = 'json.user.Login';
Login.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.uService = $.factory('service.UserService');
    this._super_('before', fn, rs);
};
Login.prototype.onGet = function onGet(fn, rs) {
    //var me = this, args = [].slice.call(arguments, 0);
    $.Log.info('-----------------------  Login   -----------------------');
    this.correctResponse('get login');
    this._super_('onPost', fn, rs);
};
Login.prototype.onPost = function onPost(fn, rs) {
    var me = this;
    $.Log.info('-----------------------  Login   -----------------------');
    //this.response['isok'] = true;
    //this.response['data'] = 'post login';
    //this.correctResponse(['post login', 'post login', 'post login']);
    //this.incorrectResponse($.error.NO_OUTPUT);
    //var store = new $.store.UserStore();
    /**/
    this.uService.readUser(2002, function(ret) {
        //me.uService.updList([2002], {"2002":{nick:"Lay Li"}}, function() {});
        /*me.uService.clrList([2001, 2002], function(ret) {
            $.Log.debug(ret);
        });*/
        me.correctResponse(ret.toUserSummary());
        me._super_('onPost', fn, rs);
    });
    //this._super_('onPost', fn, rs);
};
Login.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
