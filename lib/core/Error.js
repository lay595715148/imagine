/* jshint eqeqeq: false */
/* global $ */
"use strict";

module.exports = exports = Error;

(function() {
    Error.classname = 'core.Error';
    Error.configure = function configure(key) {
        if($.Util.isArray(key)) {
            key.map(function(k) {
                Error.configure(k);
            });
        } else if($.Util.isObject(key)) {
            Object.keys(key).map(function(k) {
                Error.configure(k);
            });
        } else if($.Util.isString(key)) {
            Error[key] = Error[key] || new Error();
            var code = $.get('error-codes.' + key), message = $.get('error-messages.' + key);
            Error[key].__defineGetter__('_new_', function() {
                return (function(c, m) {
                    var e = new Error();
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
                })(code, message);
            });
            Error[key].__defineGetter__('code', function() {
                return (function(c) {
                    return c;
                })(code);
            });
            Error[key].__defineGetter__('message', function() {
                return (function(m) {
                    return m;
                })(message);
            });
        }
    };
})();
