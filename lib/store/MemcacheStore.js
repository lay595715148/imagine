
function MemcacheStore(model) {
    $.core.Memcache.apply(this, [model, $.get('servers.memcache.master')]);
    this.classname = 'store.MemcacheStore';
}

$.Util.inherits(MemcacheStore, $.core.Memcache);

module.exports = exports = MemcacheStore;
