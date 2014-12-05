
function OAuth2CodeMongo() {
    $.store.MongoStore.apply(this, [$.model.OAuth2Code]);
}

$.Util.inherits(OAuth2CodeMongo, $.store.MongoStore);

module.exports = exports = OAuth2CodeMongo;

OAuth2CodeMongo.classname = 'store.mongo.OAuth2CodeMongo';
