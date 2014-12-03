var Utilities = require('util');
var _ = require('underscore');
var inherits = Utilities.inherits;

_.extend(Utilities, _);

module.exports = exports = Utilities;

//global.$util = global.$util || Utilities;

Utilities.inherits = function(Sub, Sup) {
    //var d = 0, p = Sup.prototype;
    inherits(Sub, Sup);
    (function(subProto, supProto) {
        //this.constructor.super_.prototype;
        subProto._super_ = function _super_(name) {
            //$.Log.warn(arguments.callee);
            var str = '' + subProto[name];
            console.log(subProto[name]);
            while(str && '' + supProto[name] === str) {
                supProto = Object.getPrototypeOf(supProto);
            }
            return supProto[name].apply(this, [].slice.call(arguments, 1));
        };
        //subProto.getClass = Utilities.bind(subProto, Utilities.getClass);
    })(Sub.prototype, Sup.prototype);
};
/**
 * 
 * @param {Function}
 *            constructor
 * @param {Array}
 *            args
 * @returns {Object}
 */
Utilities.construct = function(constructor) {
    var args = [].slice.call(arguments, 1);
    //args = Utilities.isArray(args) ? args : [];
    //return constructor.apply(constructor.prototype, args);
    /**/
    return (function(fn) {
        fn.prototype = constructor.prototype;
        return new fn();
    })(function() {
        return constructor.apply(this, args);
    });
    //旧方法
    /*var fn = function() {
        return constructor.apply(this, args);
    };
    fn.prototype = constructor.prototype;
    return new fn();*/
};
/**
 * 
 * @param target
 *            {Object}
 * @returns {Object}
 * @api public
 */
Utilities._extend_ = function(target) {
    var sources = [].slice.call(arguments, 1);
    target = Utilities.isObject(target) ? target || {} : {};
    sources.forEach(function(source) {
        // 新方法参考merge-descriptors(https://www.npmjs.org/package/merge-descriptors,https://github.com/component/merge-descriptors)
        if(Utilities.isObject(source) && !Utilities.isEmpty(source)) {
            Object.getOwnPropertyNames(source).forEach(function(name) {
                var descriptor = Object.getOwnPropertyDescriptor(source, name);
                Object.defineProperty(target, name, descriptor);
            });
        }
        // 下面是旧的方法，保留参考
        /*
         * if(Utilities.isObject(source) && !Utilities.isEmpty(source)) { for(
         * var prop in source) { //增加setter和getter条件 var g =
         * source.__lookupGetter__(prop), s = source.__lookupSetter__(prop);
         * if(g || s) { if(g) target.__defineGetter__(prop, g); if(s)
         * target.__defineSetter__(prop, s); } else { target[prop] =
         * source[prop]; } } }
         */
    });
    return target;
};
Utilities.merge = function(target) {
    return Utilities.extend.apply(null, arguments);
};
/*Utilities.clone = function(target) {
    return Utilities.extend({}, target);
};
Utilities.bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
};*/
Utilities.ucfirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
/**
 * 计算绝对地址
 * 
 * @public
 * @param <string> url
 *            原url
 * @return <string> 绝对URL
 * @static
 */
Utilities.compute = function(url, base) {
    var rootMatcher = /(^\w+:((\/\/\/\w\:)|(\/\/[^\/]*))?)/;
    var homeFormater = /(^\w+:\/\/[^\/#\?]*$)/;
    var urlTrimer = /[#\?].*$/;
    var dirTrimer = /[^\/\\]*([#\?].*)?$/;
    var forwardTrimer = /[^\/]+\/\.\.\//;
    var purl = url.replace(urlTrimer, '').replace(/\\/g, '/');
    var surl = url.substr(purl.length);

    base = document && window ? document.location.href.replace(homeFormater, "$1/").replace(dirTrimer, "") : (base || '');
    // prompt(rootMatcher.test(purl),[purl , surl])
    if(rootMatcher.test(purl)) {
        return purl + surl;
    } else if(purl.charAt(0) == '/') {
        return rootMatcher.exec(base)[0] + purl + surl;
    }
    purl = base + purl;
    while(purl.length > (purl = purl.replace(forwardTrimer, '')).length) {
        // alert(purl)
    }
    return purl + surl;
};
/**
 * convert to json format
 * 
 * @api public
 */
Utilities.json = function(target, hasFun) {
    var obj;
    if(Utilities.isArray(target)) {
        obj = [];
        target.forEach(function(item, index, arr) {
            if(Utilities.isArray(item) || Utilities.isObject(item)) {
                obj[index] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                // obj[index] = item;
            } else {
                obj[index] = item;
            }
        });
    } else if(Utilities.isObject(target) && !Utilities.isNull(target)) {
        obj = {};
        for( var p in target) {
            var item = target[p];
            if(Utilities.isObject(item) || Utilities.isArray(item)) {
                obj[p] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                // obj[p] = item;
            } else {
                obj[p] = item;
            }
        }
    } else if(Utilities.isFunction(target) && hasFun !== true) {
        obj = undefined;
    } else {
        obj = target;
    }
    return obj;
};
/**
 * string convert to json
 * 
 * @param {String}
 */
Utilities.toJson = function(str) {
    var json = {};

    if(!Utilities.isString(str))
        return false;

    try {
        json = JSON.parse(str);
    } catch(err) {
        try {
            json = (new Function("return " + str))();
        } catch(err) {
            $.Log.error(err);
        }
    }
    return json;
};
/**
 * json convert to xml string
 * 
 * @param {String}
 */
Utilities.toXml = function(json, head, index) {
    var strXml = Utilities.isString(head) ? head : "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    var regulStr = function(str) {
        if(str == "")
            return "";
        var s = str;
        var spacial = ["<", ">", "\"", "'", "&"];
        var forma = ["&lt;", "&gt;", "&quot;", "&apos;", "&amp;"];
        for(var i = 0; i < spacial.length; i++) {
            s = s.replace(new RegExp(spacial[i], "g"), forma[i]);
        }
        return s;
    };
    var appendText = function(str, s) {
        s = regulStr(s);
        return s == "" ? str : str + s + "\n";
    };
    var appendFlagBegin = function(str, s) {
        return str + "<" + s + ">\n";
    };
    var appendFlagEnd = function(str, s) {
        return str + "</" + s + ">\n";
    };

    if(arguments.length == 2) {
        strXml = arguments[1];
    }

    if(Utilities.isArray(json)) {
        index = Utilities.isString(index) ? index : 'item';
        json.forEach(function(item) {
            strXml = appendFlagBegin(strXml, index);
            strXml = Utilities.toXml(item, strXml);
            strXml = appendFlagEnd(strXml, index);
        });
    } else if(Utilities.isObject(json)) {
        for( var tag in json) {
            strXml = appendFlagBegin(strXml, tag);
            strXml = Utilities.toXml(json[tag], strXml);
            strXml = appendFlagEnd(strXml, tag);
        }
    } else if(Utilities.isString(json)) {
        strXml = appendText(strXml, json);
    } else {
        strXml = appendText(strXml, Utilities.toString(json));
    }

    return strXml;
};

/**
 * @api public
 */
Utilities.toString = function(json) {
    var str = '';

    if(Utilities.isNull(json) || Utilities.isUndefined(json) || Utilities.isError(json))
        return str;

    try {
        str = JSON.stringify(json);
    } catch(err) {
        $.Log.error(err);
    }
    return str;
};
Utilities.getClass = function(obj) {
    if(Utilities.isObject(obj) && !Utilities.isNull(obj)) {
        return obj.constructor ? obj.constructor.name : 'Object';
    } else if(Utilities.isFunction(obj)) {
        return obj.name;
    } else {
        return false;
    }
};
Utilities.time = function() {
    return Math.floor(new Date().getTime() / 1000);
};
Utilities.search = function(obj, value, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    for( var prop in obj) {
        if(this.hasOwnProperty(prop)) {
            if(equal && obj[prop] === value)
                return prop;
            else if(obj[prop] == value)
                return prop;
        }
    }
};
/**
 * @api public
 */
/*Utilities.toArray = function(enu) {
    return [].slice.call(enu, 0);
};*/
Utilities.unique = function(arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    for(var i = 0; i < arr.length;) {
        var a = arr.splice(i, 1);
        if(!Utilities.inArray(a[0], arr)) {
            arr.splice(i, 0, a[0]);
            i++;
        }
    }
    return arr;
};
Utilities.inArray = function(k, arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    return (function check(i) {
        if(i >= arr.length)
            return false;
        if(equal === true && arr[i] === k)
            return true;
        if(equal === false && arr[i] == k)
            return true;
        return check(i+1);
    }(0));
};
/**
 * sorted object keys
 */
Utilities.sortedKeys = function(obj) {
    return Object.keys(obj).sort();
};
/**
 * number sort
 */
Utilities.nsort = function(arr, asc) {
    asc = Utilities.isBoolean(asc) ? asc : true;
    arr.sort(function(x, y) {
        return asc ? parseFloat(x) - parseFloat(y) : parseFloat(y) - parseFloat(x);
    });
    return arr;
};

/**
 * Unpacks a buffer to a number.
 * 
 * @api public
 */
Utilities.unpack = function(buffer) {
    var n = 0;
    for(var i = 0; i < buffer.length; ++i) {
        n = (i == 0) ? buffer[i] : (n * 256) + buffer[i];
    }
    return n;
};

/**
 * Left pads a string.
 * 
 * @api public
 */
Utilities.padl = function(s, n, c) {
    return new Array(1 + n - s.length).join(c) + s;
};

//global.isArray = Utilities.isArray;
//global.isRegExp = Utilities.isRegExp;
//global.isDate = Utilities.isDate;
//global.isError = Utilities.isError;

/**
 * @api public
 */
Utilities.isString = function(str) {
    return 'string' === typeof str ? true : false;
};
/**
 * @api public
 */
Utilities.isNumber = function(num) {
    return 'number' === typeof num ? true : false;
};
/**
 * @api public
 */
/*Utilities.isBoolean = function(bool) {
    return 'boolean' === typeof bool ? true : false;
};*/
/**
 * @api public
 */
/*Utilities.isObject = function(obj) {
    return 'object' === typeof obj ? true : false;
};*/
/**
 * @api public
 */
Utilities.isPureObject = function(o) {
    return o !== undefined && o !== null && !Utilities.isFunction(o) && !Utilities.isString(o)
            && !Utilities.isNumber(o) && !Utilities.isBoolean(o) && !Utilities.isArray(o) && !Utilities.isDate(o)
            && !Utilities.isRegExp(o) && !Utilities.isError(o);
};
/**
 * @api public
 */
Utilities.isA = function(o, O) {
    return Utilities.isFunction(O) && o instanceof O ? true : false;
};
/**
 * @api public
 */
Utilities.isAs = function(objs, O) {
    if(Utilities.isArray(objs)) {
        for( var i in objs) {
            if(!Utilities.isA(objs[i], O)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
/**
 * @api public
 */
Utilities.isOs = function(objs, O) {
    if(Utilities.isPureObject(objs)) {
        for( var i in objs) {
            if(!Utilities.isA(objs[i], O)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};
/**
 * @api public
 */
Utilities.isDefined = function(o) {
    return !Utilities.isUndefined(o);
};
/**
 * @api public
 */
/*Utilities.isUndefined = function(o) {
    return 'undefined' === typeof o ? true : false;
};*/
/**
 * @api public
 */
Utilities.isInteger = function(n) {
    return 'number' === typeof n && n % 1 === 0 ? true : false;
};
/**
 * @api public
 */
Utilities.isFloat = function(n) {
    return 'number' === typeof n && n !== parseInt(n, 10) && !isNaN(n) ? true : false;
};
/**
 * @api public
 */
Utilities.isScalar = function(o) {
    return Utilities.isBoolean(o) || Utilities.isNumber(o) || Utilities.isString(o);
};
/**
 * @api public
 */
Utilities.isBinary = function(bin) {

};
/**
 * @api public
 */
/*Utilities.isFunction = function(f) {
    return 'function' === typeof f ? true : false;
};*/
/**
 * @api public
 */
/*Utilities.isNull = function(n) {
    return n === null ? true : false;
};*/
/**
 * @api public
 */
/*Utilities.isEmpty = function(o) {
    if(o === undefined || o === null)
        return true;
    if(Utilities.isArray(o) && o.length === 0)
        return true;
    if(Utilities.isString(o) && o.length === 0)
        return true;
    if(Utilities.isPureObject(o) && Object.keys(o).length === 0)
        return true;
    return false;
};*/

