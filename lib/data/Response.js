/* jshint eqeqeq: false */
/* global $ */
"use strict";

/**
 * @param isok
 *            {Boolean}
 * @param data
 *            {Object}
 * @param code
 *            {Number}
 */
function Response(isok, data, code) {
    var _isok = false, _data = '', _code = 0;

    if($.Util.isObject(isok) && !$.Util.isNull(isok)) {
        var tmp = isok;
        isok = tmp.isok;
        data = tmp.data;
        code = tmp.code;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('isok', function(isok) {
        if($.Util.isBoolean(isok))
            _isok = isok;
    });
    this.__defineSetter__('data', function(data) {
        if($.Util.isObject(data) && !$.Util.isNull(data) || $.Util.isNumber(data) || $.Util.isString(data)
                || $.Util.isBoolean(data))
            _data = data;
    });
    this.__defineSetter__('code', function(code) {
        if($.Util.isNumber(code))
            _code = code;
    });
    this.__defineGetter__('isok', function() {
        return _isok;
    });
    this.__defineGetter__('data', function() {
        return _data;
    });
    this.__defineGetter__('code', function() {
        return _code;
    });
    
    this.isok = isok;
    this.data = data;
    this.code = code;
}

module.exports = exports = Response;

(function() {
    Response.incorrectResponse = function incorrectResponse(msg, code) {
        var response = new Response(false);
        if($.Util.isException(msg)) {
            response.code = msg.code;
            response.data = msg.message;
        } else {
            response.code = code;
            response.data = msg;
        }
        return response;
    };
})();
