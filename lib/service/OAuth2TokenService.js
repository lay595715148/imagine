/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2TokenService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.OAuth2TokenMongo');
    this.store.redis = $.factory('store.redis.OAuth2TokenRedis');
    //this.store.memcache = $.factory('store.memcache.OAuth2TokenMemcache');
}

$.Util.inherits(OAuth2TokenService, $.core.Service);

module.exports = exports = OAuth2TokenService;

(function() {
    OAuth2TokenService.classname = 'service.OAuth2TokenService';
    /**
     * 检测token
     * @param {String} token
     * @param fn
     */
    OAuth2TokenService.prototype.checkToken = function(token, fn) {
        this.find(token, fn);
    };
    /**
     * 清除token
     * @param {String} token
     * @param fn
     */
    OAuth2TokenService.prototype.revokeToken = function(token, fn) {
        this.cler(token, fn);
    };
    /**
     * 生成OAuth2Token
     * @param clientId
     * @param userid
     * @param use_refresh_token
     * @param fn
     */
    OAuth2TokenService.prototype.gen = function(clientId, userid, use_refresh_token, fn) {
        var me = this;
        var lifetime = $.get('oauth2.access_token_lifetime') || 1800;
        //var token = $.Uti.MD5($.node_uuid.v4());
        //var rtoken = $.Uti.MD5($.node_uuid.v4());
        var expires = lifetime + $.Util.time();
        var confusion = $.util.Encryption.confusion();
        var info = [confusion, userid, expires];//, clientId
        var token = $.util.Encryption.encrypt(JSON.stringify(info));//$.util.Base64.encode()
        var t = new $.model.OAuth2Token();
        var async = new $.util.Async();
        
        t.setToken(token);
        t.setExpires(expires);
        t.setClientId(clientId);
        t.setUserid(userid);
        t.setType(1);
        
        async.push(this.inrt, [token, t, lifetime], this, function(ret) {
            if(ret) {
                fn(t);
                me.add(t, function() {});
            } else {
                fn(false);
            }
            if(!use_refresh_token) {
                return false;//下一个任务不执行
            }
        });
        if(use_refresh_token) {
            var rlifetime = $.get('oauth2.refresh_token_lifetime') || 86400;
            var rexpires = rlifetime + $.Util.time();
            var rconfusion = $.util.Encryption.confusion();
            var rinfo = [rconfusion, userid, rexpires, 1];//, clientId
            var rtoken = $.util.Encryption.encrypt(JSON.stringify(rinfo));//$.util.Base64.encode()
            var rt = new $.model.OAuth2Token();
            rt.setToken(rtoken);
            rt.setExpires(rexpires);
            rt.setClientId(clientId);
            rt.setUserid(userid);
            rt.setType(2);
            async.push(this.inrt, [rtoken, rt, rlifetime], this, function(ret) {
                if(ret) {
                    fn([t, rt]);
                    me.add(rt, function() {});
                } else {
                    fn(false);
                }
            });
        }
        async.exec();
    };
})();
