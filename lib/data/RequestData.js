/**
 * 请求数据对象
 * @param session {String}
 * @param action {String}
 * @param content {Object}
 */
function RequestData(session, action, content) {
    var _session = '', _action = '', _content = '';

    if($util.isObject(session) && !$util.isNull(session)) {
        var tmp = session;
        session = tmp.session;
        action = tmp.action;
        content = tmp.content;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('session', function(session) {
        if($util.isObject(session) && !$util.isNull(session) && $util.isString(session.session))
            _session = session.session;
        else if($util.isString(session))
            _session = session;
    });
    this.__defineSetter__('action', function(action) {
        if($util.isObject(action) && !$util.isNull(action) && $util.isString(action.action))
            _action = action.action;
        else if($util.isString(action))
            _action = action;
    });
    this.__defineSetter__('content', function(content) {
        if($util.isObject(content) && !$util.isNull(content) || $util.isNumber(content) || $util.isString(content)
                || $util.isBoolean(content))
            _content = content;
    });
    this.__defineGetter__('session', function() {
        return _session;
    });
    this.__defineGetter__('action', function() {
        return _action;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    
    this.session = session;
    this.action = action;
    this.content = content;
}

module.exports = exports = RequestData;

/**
 * 
 * @param session {String}
 */
RequestData.prototype.setSession = function(session) {
    this.session = session;
};
/**
 * 
 * @param action {String}
 */
RequestData.prototype.setAction = function(action) {
    this.action = action;
};
/**
 * 
 * @param content {Object}
 */
RequestData.prototype.setContent = function(content) {
    this.content = content;
};
/**
 * 
 * @returns {String}
 */
RequestData.prototype.getSession = function() {
    return this.session;
};
/**
 * 
 * @returns {String}
 */
RequestData.prototype.getAction = function() {
    return this.action;
};
/**
 * 
 * @returns {Object}
 */
RequestData.prototype.getContent = function() {
    return this.content;
};
