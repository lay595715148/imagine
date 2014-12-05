
function Search(req, res) {
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Search, $.core.Jsonor);

module.exports = exports = Search;

Search.classname = 'json.Search';
Search.prototype.onGet = function onGet(fn, rs) {
    // var info = [10001, $.Util.time()];
    // var code =
    // $.util.Base64.encode($.util.Encryption.encrypt(JSON.stringify(info)));
    // $.Log.info('encode: ' + code);$.Log.info('decode: ' +
    // $.util.Base64.decode(code));
    var code = '5122946c4d5a1453f45ac8b9e310d4884cc7a752310fd0209841486ab645f0f8';
    $.Log.info(code.length);
    $.Log.info($.util.Base64.encode(code));
    $.Log.info('decode: ' + $.util.Encryption.decrypt(code));
    this._super_('onGet', fn, rs);
};
Search.prototype.onPost = function onGet(fn, rs) {
    this.onGet(fn, rs);
};
