
function OAuth2TokenMemcache() {
    $.store.MemcacheStore.apply(this, [$.model.OAuth2Token]);
}

$.Util.inherits(OAuth2TokenMemcache, $.store.MemcacheStore);

module.exports = exports = OAuth2TokenMemcache;

OAuth2TokenMemcache.classname = 'store.mongo.OAuth2TokenMemcache';
