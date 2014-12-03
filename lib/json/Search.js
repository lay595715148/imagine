
function Search(req, res) {
    $.core.Jsonor.apply(this, arguments);
    this.classname = 'json.Search';
}

$.Util.inherits(Search, $.core.Jsonor);

module.exports = exports = Search;

Search.prototype.onGet = function onGet(fn, rs) {
    this._super_('onGet', fn, rs);
};
Search.prototype.onPost = function onGet(fn, rs) {
    this.onGet(fn, rs);
};
