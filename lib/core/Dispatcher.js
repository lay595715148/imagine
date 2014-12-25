/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Dispatcher() {
}

module.exports = exports = Dispatcher;

(function() {
    Dispatcher.classname = 'core.Dispatcher';
    Dispatcher.run = function run(cmd, space, req, res, callback) {
        var action = Dispatcher.gen(cmd, space, req, res);
        if(action) {
            setTimeout(function() {
                action.run(callback);
            }, 0);
        } else {
            //res.json({isok:false, code:$.error.UNSUPPORTED_CMD.code, data:$.error.UNSUPPORTED_CMD.message});
            res.json($.data.Response.incorrectResponse(new UnsupportedCmdException()));
            callback && callback();
        }
    };

    Dispatcher.gen = function gen(name, space, req, res) {
        name = name || '';
        var speices = name.replace(/[\/|\\]/, '_').split('_');
        var i = 0, index;
        $.Log.info(speices);
        for(; i < speices.length; i++) {
            if(i + 1 == speices.length) {
                index = $.Util.ucfirst(speices[i]);
            } else {
                index = speices[i];
            }
            if(space[index]) {
                space = space[index];
            } else {
                return false;
            }
        }
        return new space(name, req, res);
    };

    Dispatcher.runByClass = function runByClass(clazz, req, res, callback) {

    };

    /**
     * 内部类UnsupportedCmdException
     */
    function UnsupportedCmdException() {
        $.core.Exception.call(this, $.error.UNSUPPORTED_CMD.message, $.error.UNSUPPORTED_CMD.code);
    };

    $.Util.inherits(UnsupportedCmdException, $.core.Exception);

    UnsupportedCmdException.classname = 'core.Dispatcher.UnsupportedCmdException';
})();
