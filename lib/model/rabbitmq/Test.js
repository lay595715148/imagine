
function Test(id, name, pass, nick) {
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

$.Util.inherits(Test, $.core.Model);

module.exports = exports = Test;

Test.classname = 'model.Test';
/**
 * 
 * @param id {Number}
 */
Test.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
Test.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param name {String}
 */
Test.prototype.setPass = function(pass) {
    this.pass = pass;
};
/**
 * 
 * @param nick {String}
 */
Test.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * 
 * @param id {Number}
 */
Test.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param name {String}
 */
Test.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @param name {String}
 */
Test.prototype.getPass = function() {
    return this.pass;
};
/**
 * 
 * @param nick {String}
 */
Test.prototype.getNick = function() {
    return this.nick;
};

Test.table = Test.prototype.table = function() {
    return 'lay_test';
};
Test.columns = Test.prototype.columns = function() {
    return {
        'id':'id',
        'name':'name',
        'pass':'pass',
        'nick':'nick'
    };
};
Test.primary = Test.prototype.primary = function() {
    return 'id';
};
