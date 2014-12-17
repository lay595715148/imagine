
function Show() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Show, $.core.Jsonor);

module.exports = exports = Show;

Show.classname = 'api.user.Show';

Show.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.cService = $.factory('service.ClientService');
    this.uService = $.factory('service.UserService');
    this.oService = $.factory('service.OAuth2Service');
    this.ocService = $.factory('service.OAuth2CodeService');
    this.otService = $.factory('service.OAuth2TokenService');
    this._super_('before', fn, rs);
};
Show.prototype.onGet = function onGet(fn, rs) {
    $.Log.info('-----------------------   Show   -----------------------');
    var me = this;
    var scope = this.scope;
    var request = scope.request();
    var async = new $.util.Async();
    /**
     * 失败响应
     */
    var failure = function(msg, code) {
        me.incorrectResponse(msg, code);
        me._super_('onGet', fn, rs);
    };
    /**
     * 成功响应
     */
    var success = function(ret) {
        me.correctResponse(ret);
        me._super_('onGet', fn, rs);
    };
    var getUser = function(ret) {
        if(ret && $.Util.isA(ret, $.model.User)) {
            success(ret.toUserSummary());
        } else {
            failure($.error.UNKOWN_USER);
        }
    };
    var checkToken = function(ret) {
        if(ret && ret.type == 1 && ret.userid == request.userid) {
            //打开获取用户接口
            async.push(me.uService.get, [ret.userid], me.uService, getUser);
        } else {
            failure($.error.INVALID_TOKEN);
        }
    };
    
    var checked = this.oService.checkRequest(scope, $.service.OAuth2Service.REQUEST_TYPE_SHOW);
    if(checked) {
        async.push(me.otService.checkToken, [request.access_token], me.otService, checkToken);
        async.exec();
    } else {
        failure($.error.INVALID_REQUEST);
    }
};
Show.prototype.onPost = function onPost(fn, rs) {
    this.onGet(fn, rs);
};
Show.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
