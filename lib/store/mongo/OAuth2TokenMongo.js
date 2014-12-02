
function OAuth2TokenMongo() {
    $.store.MongoStore.apply(this, [$.model.OAuth2Token]);
    this.classname = 'store.mongo.OAuth2TokenMongo';
}

$.Util.inherits(OAuth2TokenMongo, $.store.MongoStore);

module.exports = exports = OAuth2TokenMongo;
