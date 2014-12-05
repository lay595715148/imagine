
function MemcacheStore(model) {
    $.core.Memcache.apply(this, [model, $.get('servers.memcache.master')]);
}

$.Util.inherits(MemcacheStore, $.core.Memcache);

module.exports = exports = MemcacheStore;

MemcacheStore.classname = 'store.MemcacheStore';
