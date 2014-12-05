
/**
 * 
 */
function Client(id, clientId, clientName, clientSecret, clientType, redirectURI, location, description, icon) {
    var _id = 0, _clientId = '', _clientName = '', _clientSecret = '', _clientType = 0, _redirectURI = '', _location = '', _description = '', _icon = '';

    if($.Util.isObject(id) && !$.Util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        clientId = tmp.clientId;
        clientName = tmp.clientName;
        clientSecret = tmp.clientSecret;
        clientType = tmp.clientType;
        redirectURI = tmp.redirectURI;
        location = tmp.location;
        description = tmp.description;
        icon = tmp.icon;
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($.Util.isInteger(id))
            _id = id;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($.Util.isString(clientId) || $.Util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('clientName', function(clientName) {
        if($.Util.isString(clientName))
            _clientName = clientName;
    });
    this.__defineSetter__('clientSecret', function(clientSecret) {
        if($.Util.isString(clientSecret))
            _clientSecret = clientSecret;
    });
    this.__defineSetter__('clientType', function(clientType) {
        if($.Util.isNumber(clientType))
            _clientType = clientType;
    });
    this.__defineSetter__('redirectURI', function(redirectURI) {
        if($.Util.isString(redirectURI))
            _redirectURI = redirectURI;
    });
    this.__defineSetter__('location', function(location) {
        if($.Util.isString(location))
            _location = location;
    });
    this.__defineSetter__('description', function(description) {
        if($.Util.isString(description))
            _description = description;
    });
    this.__defineSetter__('icon', function(icon) {
        if($.Util.isString(icon))
            _icon = icon;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('clientName', function() {
        return _clientName;
    });
    this.__defineGetter__('clientSecret', function() {
        return _clientSecret;
    });
    this.__defineGetter__('clientType', function() {
        return _clientType;
    });
    this.__defineGetter__('redirectURI', function() {
        return _redirectURI;
    });
    this.__defineGetter__('location', function() {
        return _location;
    });
    this.__defineGetter__('description', function() {
        return _description;
    });
    this.__defineGetter__('icon', function() {
        return _icon;
    });

    this.id = id;
    this.clientId = clientId;
    this.clientName = clientName;
    this.clientSecret = clientSecret;
    this.clientType = clientType;
    this.redirectURI = redirectURI;
    this.location = location;
    this.description = description;
    this.icon = icon;
}

$.Util.inherits(Client, $.core.Model);

module.exports = exports = Client;

Client.classname = 'model.Client';
Client.prototype.setId = function(id) {
    this.id = id;
};
Client.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
Client.prototype.setClientName = function(clientName) {
    this.clientName = clientName;
};
Client.prototype.setClientSecret = function(clientSecret) {
    this.clientSecret = clientSecret;
};
Client.prototype.setClientType = function(clientType) {
    this.clientType = clientType;
};
Client.prototype.setRedirectURI = function(redirectURI) {
    this.redirectURI = redirectURI;
};
Client.prototype.setLocation = function(location) {
    this.location = location;
};
Client.prototype.setDescription = function(description) {
    this.description = description;
};
Client.prototype.setIcon = function(icon) {
    this.icon = icon;
};
Client.prototype.getId = function() {
    return this.id;
};
Client.prototype.getClientId = function() {
    return this.clientId;
};
Client.prototype.getClientName = function() {
    return this.clientName;
};
Client.prototype.getClientSecret = function() {
    return this.clientSecret;
};
Client.prototype.getClientType = function() {
    return this.clientType;
};
Client.prototype.getRedirectURI = function() {
    return this.redirectURI;
};
Client.prototype.getLocation = function() {
    return this.location;
};
Client.prototype.getDescription = function() {
    return this.description;
};
Client.prototype.getIcon = function() {
    return this.icon;
};

Client.table = Client.prototype.table = function() {
    return 'lay_client';
};
Client.columns = Client.prototype.columns = function() {
    return {
        'id' : '_id',
        'clientId' : 'clientId',
        'clientName' : 'clientName',
        'clientSecret' : 'clientSecret',
        'clientType' : 'clientType',
        'redirectURI' : 'redirectURI',
        'location' : 'location',
        'description' : 'description',
        'icon' : 'icon'
    };
};
Client.primary = Client.prototype.primary = function() {
    return '_id';
};
Client.sequence = Client.prototype.sequence = function() {
    return '_id';
};
Client.key = Client.prototype.key = function() {
    return 'id';
};
