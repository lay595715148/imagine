
function Exception(message, code) {
    var _code = 0, _message = '';

    if($.Util.isObject(message) && !$.Util.isNull(message)) {
        var tmp = message;
        message = tmp.message;
        code = tmp.code;
    }
    
    // 一些setter和getter方法
    this.__defineSetter__('code', function(code) {
        if($.Util.isInteger(code))
            _code = code;
    });
    this.__defineSetter__('message', function(message) {
        if($.Util.isString(message))
            _message = message;
    });
    this.__defineGetter__('code', function() {
        return _code;
    });
    this.__defineGetter__('message', function() {
        return _message;
    });

    this.code = code;
    this.message = message;
}

$.Util.inherits(Exception, Error);

module.exports = exports = Exception;

Exception.classname = 'core.Exception';
Exception.configure = function configure(key) {
    if($.Util.isArray(key)) {
        key.map(function(k) {
            Exception.configure(k);
        });
    } else if($.Util.isObject(key)) {
        Object.keys(key).map(function(k) {
            Exception.configure(k);
        });
    } else if($.Util.isString(key)) {
        var code = $.get('error-codes.' + key), message = $.get('error-messages.' + key);
        Exception[key] = Exception[key] || new Exception(message, code);
        
        /*Exception[key].__defineGetter__('_new_', function() {
            return (function(m, c) {
                var e = new Exception(m, c);
                e.__defineGetter__('code', function() {
                    return (function(c) {
                        return c;
                    })(c);
                });
                e.__defineGetter__('message', function() {
                    return (function(m) {
                        return m;
                    })(m);
                });
                return e;
            })(message, code);
        });*/
        /*Exception[key].__defineGetter__('code', function() {
            return (function(c) {
                return c;
            })(code);
        });
        Exception[key].__defineGetter__('message', function() {
            return (function(m) {
                return m;
            })(message);
        });*/
    }
};

Exception.prototype._new_ = function _new_() {
    return new Exception(this.message, this.code);
};
