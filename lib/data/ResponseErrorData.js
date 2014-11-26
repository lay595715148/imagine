/**
 * @param success
 *            {Boolean}
 * @param action
 *            {String}
 * @param message
 *            {String}
 * @param code
 *            {Number}
 */
function ResponseErrorData(success, action, message, code) {
    var _success = false, _action = '', _message = '', _code = 0;

    if($util.isObject(success) && !$util.isNull(success)) {
        var tmp = success;
        success = tmp.success;
        action = tmp.action;
        message = tmp.message;
        code = tmp.code;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('success', function(success) {
        if($util.isBoolean(success))
            _success = success;
    });
    this.__defineSetter__('action', function(action) {
        if($util.isString(action))
            _action = action;
    });
    this.__defineSetter__('message', function(message) {
        if($util.isString(message))
            _message = message;
    });
    this.__defineSetter__('code', function(code) {
        if($util.isNumber(code))
            _code = code;
    });
    this.__defineGetter__('success', function() {
        return _success;
    });
    this.__defineGetter__('action', function() {
        return _action;
    });
    this.__defineGetter__('message', function() {
        return _message;
    });
    this.__defineGetter__('code', function() {
        return _code;
    });
    
    this.success = success;
    this.action = action;
    this.message = message;
    this.code = code;
}

module.exports = exports = ResponseErrorData;

/**
 * 
 * @param success
 *            {Boolean}
 */
ResponseErrorData.prototype.setSuccess = function(success) {
    this.success = success;
};
/**
 * 
 * @param action
 *            {String}
 */
ResponseErrorData.prototype.setAction = function(action) {
    this.action = action;
};
/**
 * 
 * @param message
 *            {String}
 */
ResponseErrorData.prototype.setMessage = function(message) {
    this.message = message;
};
/**
 * 
 * @param code
 *            {Number}
 */
ResponseErrorData.prototype.setCode = function(code) {
    this.code = code;
};
/**
 * 
 */
ResponseErrorData.prototype.getSuccess = function() {
    return this.success;
};
/**
 * 
 */
ResponseErrorData.prototype.getAction = function() {
    return this.action;
};
/**
 * 
 */
ResponseErrorData.prototype.getMessage = function() {
    return this.message;
};
/**
 * 
 */
ResponseErrorData.prototype.getCode = function() {
    return this.code;
};
