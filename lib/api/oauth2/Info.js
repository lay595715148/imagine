/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Info() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.ware.action.Jsonor.apply(this, arguments);
}

$.Util.inherits(Info, $.ware.action.Jsonor);

module.exports = exports = Info;

(function() {
    Info.classname = 'api.oauth2.Info';
    Info.prototype.before = function before(fn, rs) {
        //初妈化一些service
        this.cService = $.factory('service.ClientService');
        this.uService = $.factory('service.UserService');
        this.oService = $.factory('service.OAuth2Service');
        this.ocService = $.factory('service.OAuth2CodeService');
        this.otService = $.factory('service.OAuth2TokenService');
        this._super_(Info._super_.before, fn, rs);
    };

    Info.prototype.onGet = function onGet(fn, rs) {
        var me = this;
        var scope = this.scope;
        var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session(), suser = scope.user();
        //var suser = this.req.user;//session memecache user
        var response_type = request.response_type || 'code';
        var checked = this.oService.checkRequest(scope);
        var clientId = get.client_id;
        var redirectURI = get.redirect_uri;
        var clientType = response_type == 'token'?3:1;

        /**
         * 失败响应
         */
        var failure = function(msg, code) {
            me.incorrectResponse(msg, code);
            me._super_(Info._super_.onGet, fn, rs);
        };
        /**
         * 成功响应
         */
        var success = function(ret) {
            me.correctResponse(ret);
            me._super_(Info._super_.onGet, fn, rs);
        };

        if(checked) {
            var async = new $.util.Async();
            var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
            async.push(this.cService.checkClient, args, this.cService, function(ret) {
                if(ret) {
                    me.user = suser;
                    me.template = 'login.jade';
                    success({login_type:'authorize', title:'Info',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
                } else {
                    failure($.error.INVALID_CLIENT);
                }
            });
            async.exec();
        } else {
            failure($.error.INVALID_REQUEST);
        }
    };
    Info.prototype.onPost = function onPost(fn, rs) {
        this.onGet(fn, rs);
    };
})();
