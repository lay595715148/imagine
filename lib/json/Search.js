
function Search(req, res) {
    $.json.Login.apply(this, arguments);
    this.classname = 'json.Search';
}

$.Util.inherits(Search, $.json.Login);

module.exports = exports = Search;

Search.prototype.run = function() {
    this._super_('run');
};
