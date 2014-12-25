/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Exit() {
    $.ware.action.Profiler.apply(this, arguments);
}

$.Util.inherits(Exit, $.ware.action.Profiler);

module.exports = exports = Exit;

(function() {
    Exit.classname = 'api.oauth2.Exit';

    Exit.prototype.onGet = function onGet(fn, rs) {
    	var me = this;
        /**
         * 失败响应
         */
        var failure = function(msg, code) {
            me.incorrectResponse(msg, code);
            me._super_(Exit._super_.onGet, fn, rs);
        };
        /**
         * 成功响应
         */
        var success = function() {
            me.redirect('/');
            me._super_(Exit._super_.onGet, fn, rs);
        };

        this.remove(function(ret) {
        	if(ret) {
            	success();
        	} else {
        		failure($.error.UNKOWN_ERROR);
        	}
        });
    };
    Exit.prototype.onPost = function onPost(fn, rs) {
    	this.onGet(fn, rs);
    }
})();
