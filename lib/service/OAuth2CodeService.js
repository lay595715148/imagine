/* jshint eqeqeq: false */
/* global $ */
"use strict";

function OAuth2CodeService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.OAuth2CodeMongo');
    this.store.redis = $.factory('store.redis.OAuth2CodeRedis');
    //this.store.memcache = $.factory('store.memcache.OAuth2CodeMemcache');
}

$.Util.inherits(OAuth2CodeService, $.core.Service);

module.exports = exports = OAuth2CodeService;

(function() {
    OAuth2CodeService.classname = 'service.UserService';
    /**
     * 
     * @param code
     * @param fn
     */
    OAuth2CodeService.prototype.checkCode = function checkCode(code, fn) {
        this.find(code, fn);
    };
    /**
     * 生成OAuth2Code
     * @param clientId
     * @param userid
     * @param redirectURI
     * @param fn
     */
    OAuth2CodeService.prototype.gen = function gen(clientId, userid, redirectURI, fn) {
        var me = this;
        var lifetime = $.get('oauth2.code_lifetime') || 100;
        //var code = $.Util.MD5($.node_uuid.v4());
        var expires = lifetime + $.Util.time();
        var confusion = $.util.Encryption.confusion();
        var info = [confusion, userid, expires];//, clientId
        var code = $.util.Encryption.encrypt(JSON.stringify(info));//$.util.Base64.encode()
        var c = new $.model.OAuth2Code();
        
        c.setCode(code);
        c.setExpires(expires);
        c.setClientId(clientId);
        c.setUserid(userid);
        c.setRedirectURI(redirectURI);
        
        this.inrt(code, c, lifetime, function(ret) {
            if(ret) {
                fn(c);
                me.add(c, function() {});
            } else {
                fn(false);
            }
        });
    };
})();
