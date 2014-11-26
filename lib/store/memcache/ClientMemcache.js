
function ClientMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.Client]);
    this.classname = 'store.memcache.ClientMemcache';
}

$.Util.inherits(ClientMemcache, $.store.MemcacheStore);

module.exports = exports = ClientMemcache;

