/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Htmler(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Jade(req, res));
}

$.Util.inherits(Htmler, $.core.Action);

module.exports = exports = Htmler;

(function() {
	Htmler.classname = 'ware.action.Htmler';
	Htmler.prototype.before = function before(fn, rs) {
        if(this.demandUser() && !this.isLogin()) {
            this.hasPermission = false;
            this.noPermission();
        } else {
            
        }
        this._super_(Htmler._super_.before, fn, rs);
	};
    //权限设置 
    //标记是否需要用户存在
    Htmler.prototype.demandUser = function demandUser() {
        return false;
    };
    Htmler.prototype.demandAdmin = function demandAdmin() {
        return false;
    };
    /**
     * 在cookie中检测是否登录
     * @returns
     */
    Htmler.prototype.isLogin = function isLogin() {
        var sessid = $.get('sign.cookie.session') || 'sid';
        var cookie = this.scope.cookie();
        var key = cookie[sessid];
        var info = $.util.Encryption.decrypt(key).split(',');//$.Util.toJson()
        $.Log.debug(info);
        return $.Util.isNumber(info[1]) && info[1] > 0 ? info[1] : false;
    };
    Htmler.prototype.setLogined = function setLogined(userid) {
        userid = $.Util.isNumber(userid) ? userid : 0;
        
        var sessid = $.get('sign.cookie.session') || 'sid';
        var cookie = this.scope.cookie();
        var confusion = $.util.Encryption.confusion(1);
        //var info = JSON.stringify([confusion, userid, $.Util.time(), 0]);
        var info = confusion + ',' + 200018772 + ',' + $.Util.time();
        var code = cookie[sessid] = $.util.Encryption.encrypt(info);//$.util.Base64.encode()
        $.Log.info('SESSION create', sessid, code);
        this.res.cookie(sessid, code);
        this.scope.resolve(true);
        return code;
    };
    Htmler.prototype.setLogouted = function setLogouted() {
        var sessid = $.get('sign.cookie.session') || 'sid';
        var cookie = this.scope.cookie();
        $.Log.info('SESSION remove', sessid);
        this.res.clearCookie(sessid);
        this.scope.resolve(true);
        return true;
    };
    Htmler.prototype.noPermission = function noPermission() {
        this.redirect('/', false);
    };
    Htmler.prototype.noAdminPermission = function noAdminPermission() {
        this.noPermission();
    };
})();
