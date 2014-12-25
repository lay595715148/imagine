/* jshint eqeqeq: false */
/* global $ */
"use strict";

function User(id, name, display_name) {
    var _id = 0, _name = '', _display_name = '';
    
    if($.Util.isObject(id) && !$.Util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        display_name = tmp.display_name;
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
    this.__defineSetter__('display_name', function(display_name) {
        if($.Util.isString(display_name))
            _display_name = display_name;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('display_name', function() {
        return _display_name;
    });
    
    this.id = id;
    this.name = name;
    this.display_name = display_name;
}

$.Util.inherits(User, $.core.Model);

module.exports = exports = User;

(function() {
    User.classname = 'model.solr.User';
    User.table = User.prototype.table = function() {
        return 'new_user';
    };
    User.columns = User.prototype.columns = function() {
        return {
            'id':'id',
            'name':'name',
            'display_name':'display_name'
        };
    };
    User.primary = User.prototype.primary = function() {
        return 'id';
    };
})();
