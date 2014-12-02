
/**
 * 
 */
function OAuth2Code(code, userid, clientId, redirectURI, expires) {
    var _code = '', _userid = '', _clientId = '', _redirectURI = '', _expires = 0;

    if($.Util.isObject(code) && !$.Util.isNull(code)) {
        var tmp = code;
        code = tmp.code;
        userid = tmp.userid;
        clientId = tmp.clientId;
        redirectURI = tmp.redirectURI;
        expires = tmp.expires;
    }

    // 一些setter和getter方法
    this.__defineSetter__('code', function(code) {
        if($.Util.isString(code))
            _code = code;
    });
    this.__defineSetter__('userid', function(userid) {
        if($.Util.isString(userid) || $.Util.isNumber(userid))
            _userid = userid;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($.Util.isString(clientId) || $.Util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('redirectURI', function(redirectURI) {
        if($.Util.isString(redirectURI))
            _redirectURI = redirectURI;
    });
    this.__defineSetter__('expires', function(expires) {
        if($.Util.isInteger(expires))
            _expires = expires;
    });
    this.__defineGetter__('code', function() {
        return _code;
    });
    this.__defineGetter__('userid', function() {
        return _userid;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('redirectURI', function() {
        return _redirectURI;
    });
    this.__defineGetter__('expires', function() {
        return _expires;
    });

    this.code = code;
    this.userid = userid;
    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.expires = expires;
    this.classname = 'model.OAuth2Code';
}

$.Util.inherits(OAuth2Code, $.core.Model);

module.exports = exports = OAuth2Code;

OAuth2Code.prototype.setCode = function(code) {
    this.code = code;
};
OAuth2Code.prototype.setUserid = function(userid) {
    this.userid = userid;
};
OAuth2Code.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
OAuth2Code.prototype.setRedirectURI = function(redirectURI) {
    this.redirectURI = redirectURI;
};
OAuth2Code.prototype.setExpires = function(expires) {
    this.expires = expires;
};
OAuth2Code.prototype.getCode = function() {
    return this.code;
};
OAuth2Code.prototype.getUserid = function() {
    return this.userid;
};
OAuth2Code.prototype.getClientId = function() {
    return this.clientId;
};
OAuth2Code.prototype.getRedirectURI = function() {
    return this.redirectURI;
};
OAuth2Code.prototype.getExpires = function() {
    return this.expires;
};

OAuth2Code.prototype.toOAuth2CodeSummary = function() {
    return new OAuth2CodeSummary(this);
};

OAuth2Code.table = OAuth2Code.prototype.table = function() {
    return 'lay_oauth2_code';
};
OAuth2Code.columns = OAuth2Code.prototype.columns = function() {
    return {
        'code' : '_id',
        'userid' : 'userid',
        'clientId' : 'clientId',
        'redirectURI' : 'redirectURI',
        'expires' : 'expires'
    };
};
OAuth2Code.primary = OAuth2Code.prototype.primary = function() {
    return '_id';
};
OAuth2Code.key = OAuth2Code.prototype.key = function() {
    return 'code';
};
