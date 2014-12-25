/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Revoke() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.ware.action.Jsonor.apply(this, arguments);
}

$.Util.inherits(Revoke, $.ware.action.Jsonor);

module.exports = exports = Revoke;

(function() {
    Revoke.classname = 'api.oauth2.Revoke';
    Revoke.prototype.before = function before(fn, rs) {
        //初妈化一些service
        this.cService = $.factory('service.ClientService');
        this.uService = $.factory('service.UserService');
        this.oService = $.factory('service.OAuth2Service');
        this.ocService = $.factory('service.OAuth2CodeService');
        this.otService = $.factory('service.OAuth2TokenService');
        this._super_(Revoke._super_.before, fn, rs);
    };

    Revoke.prototype.onGet = function onGet(fn, rs) {
        var me = this;
        var scope = this.scope;
        var request = scope.request();
        var async = new $.util.Async();
        /**
         * 失败响应
         */
        var failure = function(msg, code) {
            me.incorrectResponse(msg, code);
            me._super_(Revoke._super_.onGet, fn, rs);
        };
        /**
         * 成功响应
         */
        var success = function(ret) {
            me.correctResponse(ret);
            me._super_(Revoke._super_.onGet, fn, rs);
        };
        var revokeToken = function(ret) {
            if(ret) {
                success(ret);
            } else {
                failure($.error.DISREVOKE_TOKEN);
            }
        };
        var checkToken = function(ret) {
            if(ret) {
                async.push(me.otService.revokeToken, [request.access_token], me.otService, revokeToken);
            } else {
                failure($.error.INVALID_TOKEN);
            }
        };
        async.push(me.otService.checkToken, [request.access_token], me.otService, checkToken);
        async.exec();
    };
    Revoke.prototype.onPost = function onPost(fn, rs) {
        this.onGet(fn, rs);
    };
})();
