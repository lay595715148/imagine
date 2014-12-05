
function ClientMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.Client]);
}

$.Util.inherits(ClientMemcache, $.store.MemcacheStore);

module.exports = exports = ClientMemcache;

ClientMemcache.classname = 'store.memcache.ClientMemcache';

