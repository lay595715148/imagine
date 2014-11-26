/**
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 */
function ListData(list, total, hasNext) {
    var _list = [], _total = 0, _hasNext = false;
    
    if($util.isObject(list) && !$util.isNull(list) && !$util.isArray(list)) {
        var tmp = list;
        list = tmp.list;
        total = tmp.total;
        hasNext = tmp.hasNext;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('list', function(list) {
        if($util.isArray(list))
            _list = list;
    });
    this.__defineSetter__('total', function(total) {
        if($util.isNumber(total))
            _total = total;
    });
    this.__defineSetter__('hasNext', function(hasNext) {
        if($util.isBoolean(hasNext))
            _hasNext = hasNext;
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
    
    this.list = list;
    this.total = total;
    this.hasNext = hasNext;
}

module.exports = exports = ListData;

/**
 * 
 * @param list {Array}
 */
ListData.prototype.setList = function(list) {
    this.list = list;
};
/**
 * 
 * @param total {Number}
 */
ListData.prototype.setTotal = function(total) {
    this.total = total;
};
/**
 * 
 * @param hasNext {Boolean}
 */
ListData.prototype.setHasNext = function(hasNext) {
    this.hasNext = hasNext;
};
/**
 * 
 * @returns {Array}
 */
ListData.prototype.getList = function() {
    return this.list;
};
/**
 * 
 * @returns {Number}
 */
ListData.prototype.getTotal = function() {
    return this.total;
};
/**
 * 
 * @returns {Boolean}
 */
ListData.prototype.getHasNext = function() {
    return this.hasNext;
};
