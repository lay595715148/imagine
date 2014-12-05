
function User(id, name, pass, nick) {
    var _id = 0, _name = '', _pass = '', _nick = '';
    
    if($.Util.isObject(id) && !$.Util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        pass = tmp.pass;
        nick = tmp.nick;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($.Util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($.Util.isString(name))
            _name = name;
    });
    this.__defineSetter__('pass', function(pass) {
        if($.Util.isString(pass))
            _pass = pass;
    });
    this.__defineSetter__('nick', function(nick) {
        if($.Util.isString(nick))
            _nick = nick;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('pass', function() {
        return _pass;
    });
    this.__defineGetter__('nick', function() {
        return _nick;
    });
    
    this.id = id;
    this.name = name;
    this.pass = pass;
    this.nick = nick;
}

module.exports = exports = User;

User.classname = 'model.User';
/**
 * 
 * @param id {Number}
 */
User.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setPass = function(pass) {
    this.pass = pass;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * 
 * @param id {Number}
 */
User.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @param name {String}
 */
User.prototype.getPass = function() {
    return this.pass;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.getNick = function() {
    return this.nick;
};
/**
 * 
 * @returns {UserSummary}
 */
User.prototype.toUserSummary = function() {
    return new UserSummary(this);
};
/**
 * 
 * @returns {SocketUser}
 */
User.prototype.toSocketUser = function(socket, channel, layer) {
    return new SocketUser($.Util.extend({socket:socket, channel:channel, layer:layer}, this));
};
User.prototype.toSocketUserSummary = function(socket, channel, layer) {
    return new SocketUserSummary($.Util.extend({socket:socket, channel:channel, layer:layer}, this));
};

User.table = User.prototype.table = function() {
    return 'lay_user';
};
User.columns = User.prototype.columns = function() {
    return {
        'id':'_id',
        'name':'name',
        'pass':'pass',
        'nick':'nick'
    };
};
User.primary = User.prototype.primary = function() {
    return '_id';
};
User.sequence = User.prototype.sequence = function() {
    return '_id';
};
/**
 * 主键属性名
 * @abstract
 */
User.key = User.prototype.key = function() {
    return 'id';
};
