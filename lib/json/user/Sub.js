
function Sub() {
    this.uService = null;
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Sub, $.core.Jsonor);

module.exports = exports = Sub;

Sub.classname = 'json.user.Sub';
Sub.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.uService = $.factory('service.UserService');
    this._super_('before', fn, rs);
};
Sub.prototype.onGet = function onGet(fn, rs) {
    $.Log.info('-----------------------  Sub   -----------------------');
    this.correctResponse('sub');
    this._super_('onPost', fn, rs);
};
Sub.prototype.onPost = function onPost(fn, rs) {
    var me = this;
    $.Log.info('-----------------------  Sub   -----------------------');
    this.uService.get(2002, function(ret) {
        me.uService.sub(2001, function(ret) {
            //$.Log.debug(ret);
            ret.on('message', function(msg) {
                console.log(msg);
                ret.ack();
            }.bind(this));
        });
        me.correctResponse(ret.toUserSummary());
        me._super_('onPost', fn, rs);
    });
};
Sub.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
