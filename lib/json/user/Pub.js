/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Pub() {
    this.uService = null;
    $.ware.action.Jsonor.apply(this, arguments);
}

$.Util.inherits(Pub, $.ware.action.Jsonor);

module.exports = exports = Pub;

(function() {
    Pub.classname = 'json.user.Pub';
    Pub.prototype.before = function before(fn, rs) {
        //初妈化一些service
        this.uService = $.factory('service.UserService');
        this._super_(Pub._super_.before, fn, rs);
    };
    Pub.prototype.onGet = function onGet(fn, rs) {
        $.Log.info('-----------------------  Pub   -----------------------');
        this.correctResponse('pub');
        this._super_(Pub._super_.onGet, fn, rs);
    };
    Pub.prototype.onPost = function onPost(fn, rs) {
        var me = this;
        $.Log.info('-----------------------  Pub   -----------------------');
        this.uService.get(2002, function(ret) {
            me.uService.pub(2001, function(ret) {
                //$.Log.debug(ret);
                ret.send('Hello World!');
            });
            me.correctResponse(ret.toUserSummary());
            me._super_(Pub._super_.onPost, fn, rs);
        });
    };
})();
