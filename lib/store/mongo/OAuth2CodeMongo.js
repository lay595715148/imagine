
function OAuth2CodeMongo() {
    $.store.MongoStore.apply(this, [$.model.OAuth2Code]);
    this.classname = 'store.mongo.OAuth2CodeMongo';
}

$.Util.inherits(OAuth2CodeMongo, $.store.MongoStore);

module.exports = exports = OAuth2CodeMongo;
