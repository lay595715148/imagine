
function OAuth2CodeMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.OAuth2Code]);
    this.classname = 'store.mongo.OAuth2CodeMemcache';
}

$.Util.inherits(OAuth2CodeMemcache, $.store.MemcacheStore);

module.exports = exports = OAuth2CodeMemcache;
