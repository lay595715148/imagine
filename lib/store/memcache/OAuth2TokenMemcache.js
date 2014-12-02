
function OAuth2TokenMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.OAuth2Token]);
    this.classname = 'store.mongo.OAuth2TokenMemcache';
}

$.Util.inherits(OAuth2TokenMemcache, $.store.MemcacheStore);

module.exports = exports = OAuth2TokenMemcache;
