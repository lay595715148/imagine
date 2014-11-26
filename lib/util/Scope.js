/**
 * 
 */
function Scope(req) {
    /*var _request = {}, _chunks = [];

    this.__defineSetter__('req', function(request) {
        if($.Util.isObject(request) && !$.Util.isNull(request))
            _request = request;
    });
    this.__defineSetter__('chunks', function(chunks) {
        if($.Util.isArray(chunks))
            _chunks = chunks;
    });
    this.__defineGetter__('req', function() {
        return _request;
    });
    this.__defineGetter__('chunks', function() {
        return _chunks;
    });*/

    this.req = req;
    this.chunks = [];
    this.resolve();
    this.classname = 'util.Scope';
};

// module exports
module.exports = exports = Scope;

Scope.GET = 0;
Scope.POST = 1;
Scope.REQUEST = 2;
Scope.COOKIE = 3;
Scope.SESSION = 4;
Scope.PARAM = 5;
Scope.HEADER = 6;
Scope.USER = 7;
Scope.TOKEN = 8;
/**
 * @param {Object}
 *            request
 *            request.query,request.body,request.method,request.ssession,request.cookies...
 */
Scope.prototype.get = function() {
    return this.resolve()[Scope.GET];
};
Scope.prototype.post = function() {
    return this.resolve()[Scope.POST];
};
Scope.prototype.request = function() {
    return this.resolve()[Scope.REQUEST];
};
Scope.prototype.cookie = function() {
    return this.resolve()[Scope.COOKIE];
};
Scope.prototype.session = function() {
    return this.resolve()[Scope.SESSION];
};
Scope.prototype.param = function() {
    return this.resolve()[Scope.PARAM];
};
Scope.prototype.header = function() {
    return this.resolve()[Scope.HEADER];
};
Scope.prototype.user = function() {
    return this.resolve()[Scope.USER];
};
Scope.prototype.token = function() {
    return this.resolve()[Scope.TOKEN];
};
/**
 * @api private
 * @param request
 * @param reset
 * @returns {Array}
 */
Scope.prototype.resolve = function(reset) {
    var _get = {}, _post = {}, _request = {}, _cookie = {}, _session = {}, _param = {}, _header = {}, _user = {}, _token = {};
    var request = this.req;

    if($.Util.isArray(this.chunks) && !$.Util.isEmpty(this.chunks) && reset !== true) {
        return this.chunks;
    }

    if($.Util.isObject(request)) {
        if(request.method === 'POST') {
            _get = request.query || {};
            _post = request.body || {};
            _request = $.Util.extend($.Util.clone(_get), $.Util.clone(_post));
        } else {
            _get = request.query || {};
            _request = _get;
        }
        _session = request.session || {};
        _cookie = request.cookies || {};
        _param = request.params || {};
        _header = request.headers || {};
        _user = request.user || {};
        _token = request.token || {};
    }

    return this.chunks = [_get, _post, _request, _cookie, _session, _param, _header, _user, _token];
};
