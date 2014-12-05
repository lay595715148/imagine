
function ClientService() {
    $.core.Service.apply(this, arguments);
    this.store.mongo = $.factory('store.mongo.ClientMongo');
    this.store.memcache = $.factory('store.memcache.ClientMemcache');
}

$.Util.inherits(ClientService, $.core.Service);

module.exports = exports = ClientService;

ClientService.classname = 'service.ClientService';
ClientService.prototype.read = function read(id, fn) {
    this.store.mongo.select({id:id}, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isArray(ret) && !$.Util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.checkClient = function checkClient(query, fn) {
    this.store.mongo.selectOne(query, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isA(ret, $.model.Client)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param clientname
 * @param password md5前
 */
ClientService.prototype.readBySecret = function readBySecret(clientid, clientsecret, fn) {
    this.store.mongo.selectOne({clientId:clientid, clientSecret:clientsecret}, function(ret) {
        if(!$.Util.isError(ret) && $.Util.isA(ret, $.model.Client)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.list = function list(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(clients) {
        if(!$.Util.isError(clients) && $.Util.isArray(clients)) {
            fn(clients);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.count = function count(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.count(selector, function(count) {
        if(!$.Util.isError(count)) {
            fn(count);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {Client} client
 */
ClientService.prototype.create = function create(client, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    client = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(client, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.modify = function modify(id, params, fn) {
    
};
ClientService.prototype.mread = function mread(id, fn) {
    var key = id;
    this.store.memcache.get(key, function(ret) {
        if($.Util.isString(ret)) {
            fn(Model.instance('Client', $.Util.toJson(ret)));
        } else {
            fn(ret);
        }
    });
};
ClientService.prototype.mcreate = function mcreate(client, lifetime, fn) {
    var key = id;
    if($.Util.isFunction(lifetime)) {
        fn = lifetime;
        liftime = 1800;
    }
    this.store.memcache.set(key, $.Util.toString(client), liftime, function(ret) {
        fn(ret);
    });
};
ClientService.prototype.mremove = function mremove(id, fn) {
    var key = id;
    this.store.memcache.del(key, function(ret) {
        fn(ret);
    });
};
