
/**
 * 
 */
function OAuth2Token(token, userid, clientId, type, expires) {
    var _token = '', _userid = '', _clientId = '', _type = '', _expires = 0;

    if($.Util.isObject(token) && !$.Util.isNull(token)) {
        var tmp = token;
        token = tmp.token;
        userid = tmp.userid;
        clientId = tmp.clientId;
        type = tmp.type;
        expires = tmp.expires;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('token', function(token) {
        if($.Util.isString(token))
            _token = token;
    });
    this.__defineSetter__('userid', function(userid) {
        if($.Util.isString(userid) || $.Util.isNumber(userid))
            _userid = userid;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($.Util.isString(clientId) || $.Util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('type', function(type) {
        if($.Util.isInteger(type))
            _type = type;
    });
    this.__defineSetter__('expires', function(expires) {
        if($.Util.isInteger(expires))
            _expires = expires;
    });
    this.__defineGetter__('token', function() {
        return _token;
    });
    this.__defineGetter__('userid', function() {
        return _userid;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('type', function() {
        return _type;
    });
    this.__defineGetter__('expires', function() {
        return _expires;
    });

    this.token = token;
    this.userid = userid;
    this.clientId = clientId;
    this.type = type;
    this.expires = expires;
    this.classname = 'model.OAuth2Token';
}

$.Util.inherits(OAuth2Token, $.core.Model);

module.exports = exports = OAuth2Token;

OAuth2Token.prototype.setToken = function(token) {
    this.token = token;
};
OAuth2Token.prototype.setUserid = function(userid) {
    this.userid = userid;
};
OAuth2Token.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
OAuth2Token.prototype.setType = function(type) {
    this.type = type;
};
OAuth2Token.prototype.setExpires = function(expires) {
    this.expires = expires;
};
OAuth2Token.prototype.getToken = function() {
    return this.token;
};
OAuth2Token.prototype.getUserid = function() {
    return this.userid;
};
OAuth2Token.prototype.getClientId = function() {
    return this.clientId;
};
OAuth2Token.prototype.getType = function() {
    return this.type;
};
OAuth2Token.prototype.getExpires = function() {
    return this.expires;
};

OAuth2Token.prototype.toOAuth2TokenSummary = function() {
    return this;
};

OAuth2Token.table = OAuth2Token.prototype.table = function() {
    return 'lay_oauth2_token';
};
OAuth2Token.columns = OAuth2Token.prototype.columns = function() {
    return {
        'token' : '_id',
        'userid' : 'userid',
        'clientId' : 'clientId',
        'type' : 'type',
        'expires' : 'expires'
    };
};
OAuth2Token.primary = OAuth2Token.prototype.primary = function() {
    return '_id';
};
OAuth2Token.key = OAuth2Token.prototype.key = function() {
    return 'token';
};
