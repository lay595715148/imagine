/**
 * @param url
 *            {String}
 * @param sid
 *            {String}
 * @param headers
 *            {Array}
 * @param request
 *            {Object}
 */
function Request(url, sid, headers, request) {
    var _url = '', _sid = '', _headers = [], _request = {};

    if($.Util.isObject(url) && !$.Util.isNull(url)) {
        var tmp = url;
        url = tmp.url;
        sid = tmp.sid;
        headers = tmp.headers;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('url', function(url) {
        if($.Util.isString(url))
            _url = url;
    });
    this.__defineSetter__('sid', function(sid) {
        if($.Util.isString(sid))
            _sid = sid;
    });
    this.__defineSetter__('headers', function(headers) {
        if($.Util.isArray(headers))
            _headers = headers;
    });
    this.__defineSetter__('request', function(request) {
        if($.Util.isObject(request))
            _request = request;
    });
    this.__defineGetter__('url', function() {
        return _url;
    });
    this.__defineGetter__('sid', function() {
        return _sid;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });
    this.__defineGetter__('request', function() {
        return _request;
    });
    
    this.url = url;
    this.sid = sid;
    this.headers = headers;
    this.request = request;
}

module.exports = exports = Response;

Request.instance = null;
Request.getInstance = function getInstance(req, sid) {
    if($.Util.isNull(Request.instance) && $.Util.isA(req, $.http.IncommingMessage)) {
        Request.instance = new Request(req.url, sid, req.headers, req.request);
    }
    return Request.instance;
};
