/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Redirect() {
    $.ware.action.Htmler.apply(this, arguments);
}

$.Util.inherits(Redirect, $.ware.action.Htmler);

module.exports = exports = Redirect;

(function() {
    Redirect.classname = 'api.Redirect';
    Redirect.prototype.onGet = function onGet(fn, rs) {
        var me = this;
        var scope = this.scope;
        var request = scope.request();
        var api_url = 'http://localhost:8808/oauth2/token';
        var client_secret = '2b53761249254ce6b502f521e5cc0683';
        var client_id = 'lay15483';
        var redirect_uri = 'http://localhost:8133/redirect';

        /**
         * 失败响应
         */
        var failure = function(msg, code) {
            me.incorrectResponse(msg, code);
            me._super_(Redirect._super_.onGet, fn, rs);
        };
        /**
         * 成功响应
         */
        var success = function(ret) {
            me.correctResponse(ret);
            me._super_(Redirect._super_.onGet, fn, rs);
        };
        $.request.post({
            url : api_url,
            form : {
                code : request.code,
                client_id : client_id,
                client_secret : client_secret,
                redirect_uri : redirect_uri
            }
        }, function(err, rsp, body) {
            $.Log.info('Error : ');
            $.Log.info(err);
            //$.Log.info('Response:');
            //$.Log.info(rsp);
            $.Log.info('Body : ');
            $.Log.info(body);
            if(err) {
                failure(err);
            } else {
                try {
                    body = JSON.parse(body);
                    if(body.isok) {
                        success(body.data);
                    } else {
                        failure(body.data, body.code);
                    }
                } catch (e) {
                    failure(e);
                }
            }
        });
    };
    Redirect.prototype.onPost = function onPost(fn, rs) {
        this.onGet();
    };
})();
