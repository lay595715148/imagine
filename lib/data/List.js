/* jshint eqeqeq: false */
/* global $ */
"use strict";

/**
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @param sinceId {Number}
 */
function List(list, total, hasNext, sinceId) {
    var _list = [], _total = 0, _hasNext = false, _sinceId = 0;
    
    if($.Util.isObject(list) && !$.Util.isNull(list) && !$.Util.isArray(list)) {
        var tmp = list;
        list = tmp.list;
        total = tmp.total;
        hasNext = tmp.hasNext;
        sinceId = tmp.sinceId;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('list', function(list) {
        if($.Util.isArray(list))
            _list = list;
    });
    this.__defineSetter__('total', function(total) {
        if($.Util.isNumber(total))
            _total = total;
    });
    this.__defineSetter__('hasNext', function(hasNext) {
        if($.Util.isBoolean(hasNext))
            _hasNext = hasNext;
    });
    this.__defineSetter__('sinceId', function(sinceId) {
        if($.Util.isNumber(sinceId))
            _sinceId = sinceId;
    });
    this.__defineGetter__('list', function() {
        return _list;
    });
    this.__defineGetter__('total', function() {
        return _total;
    });
    this.__defineGetter__('hasNext', function() {
        return _hasNext;
    });
    this.__defineGetter__('sinceId', function() {
        return _sinceId;
    });
    
    this.list = list;
    this.total = total;
    this.hasNext = hasNext;
    this.sinceId = sinceId;
}

module.exports = exports = List;

(function() {
    List.classname = 'data.List';
})();
