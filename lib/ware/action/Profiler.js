/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Profiler() {
    this.uService = null;
    $.ware.action.Htmler.apply(this, arguments);
}

$.Util.inherits(Profiler, $.ware.action.Htmler);

module.exports = exports = Profiler;

(function() {
    Profiler.classname = 'ware.action.Profiler';
    Profiler.prototype.before = function before(fn, rs) {
        //初妈化一些service
        this.uService = $.factory('service.UserService');
        this._super_(Profiler._super_.before, fn, rs);
    };
    /**
     * @protected
     */
    Profiler.prototype.update = function update(fn) {
        //var res = this.res;
        var req = this.req;
        var scope = this.scope;
        var cookie = scope.cookie();
        var sessid = $.get('sign.cookie.session') || 'sid';
        if($.Util.isUndefined(cookie[sessid])) {
            if(req.user) {
                this.setLogined(req.user.id);
            }
        }
        if(req.user) {
            cookie = scope.cookie();//获取更新后的cookie
            this.uService.inrt(cookie[sessid], req.user, function(ret) {
                $.Util.isFunction(fn) && fn(ret);
            });
        }
    };
    /**
     * @protected
     */
    Profiler.prototype.remove = function remove(fn) {
        var req = this.req;
        var scope = this.scope;
        var cookie = scope.cookie();
        var sessid = $.get('sign.cookie.session') || 'sid';

        if($.Util.isDefined(cookie[sessid])) {
            this.setLogouted();
            this.uService.cler(cookie[sessid], function(ret) {
                req.user = null;
                scope.resolve(true);
                $.Util.isFunction(fn) && fn(ret);
            });
        } else {
            $.Util.isFunction(fn) && fn(true);
        }
    };
})();
