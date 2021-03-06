/* jshint eqeqeq: false */
/* global $ */
"use strict";

function ClientService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.ClientMongo');
    this.store.redis = $.factory('store.redis.ClientRedis');
    //this.store.memcache = $.factory('store.memcache.ClientMemcache');
}

$.Util.inherits(ClientService, $.core.Service);

module.exports = exports = ClientService;

(function() {
    ClientService.classname = 'service.ClientService';
    /**
     * 检测Client
     * @param query
     * @param fn
     */
    ClientService.prototype.checkClient = function checkClient(query, fn) {
        this.seek(query, function(ret) {
            if(ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
    /**
     * 通过密钥检测Client
     * @param clientname
     * @param password md5前
     */
    ClientService.prototype.readBySecret = function readBySecret(clientid, clientsecret, fn) {
        this.seek({clientId:clientid, clientSecret:clientsecret}, function(ret) {
            if(ret) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    };
})();
