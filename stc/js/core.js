function Utilities() {

}
var $util = Utilities;
Utilities.inherits = inherits = function(ctor, superCtor) {
    // copy from nodejs
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor : {
            value : ctor,
            enumerable : false,
            writable : true,
            configurable : true
        }
    });
};
/**
 * 
 * @param {Function}
 *            constructor
 * @param {Array}
 *            args
 * @returns {Object}
 */
Utilities.construct = construct = function(constructor, args) {
    args = Utilities.isArray(args) ? args : [];
    function fn() {
        return constructor.apply(this, args);
    }
    fn.prototype = constructor.prototype;
    return new fn();
};
/**
 * 
 * @param target
 *            {Object}
 * @returns {Object}
 * @api public
 */
Utilities.extend = extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function(source) {
        if(Utilities.isObject(source) && !Utilities.isEmpty(source)) {
            for( var prop in source) {
                // 增加setter和getter条件
                var g = source.__lookupGetter__(prop), s = source.__lookupSetter__(prop);
                if(g || s) {
                    if(g)
                        target.__defineGetter__(prop, g);
                    if(s)
                        target.__defineSetter__(prop, s);
                } else {
                    target[prop] = source[prop];
                }
            }
        }
    });
    return target;
};
Utilities.merge = merge = function(target) {
    return Utilities.extend.apply(null, arguments);
};
Utilities.clone = clone = function(target) {
    return Utilities.extend({}, target);
};
Utilities.bind = bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
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
Utilities.compute = compute = function(url, base) {
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
Utilities.json = json = function(target, hasFun) {
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
Utilities.toJson = toJson = function(str) {
    var json = {};

    if(!Utilities.isString(str))
        return json;

    try {
        json = JSON.parse(str);
    } catch(err) {
        try {
            json = (new Function("return " + str))();
        } catch(err) {
            //
        }
    }
    return json;
};
/**
 * json convert to xml string
 * 
 * @param {String}
 */
Utilities.toXml = toXml = function(json) {
    var strXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
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
        json.forEach(function(item) {
            strXml = appendFlagBegin(strXml, 'item');
            strXml = Utilities.toXml(item, strXml);
            strXml = appendFlagEnd(strXml, 'item');
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
        //
    }
    return str;
};
/**
 * @api public
 */
Utilities.toArray = toArray = function(enu) {
    var arr = [];

    for(var i = 0, l = enu.length; i < l; i++)
        arr.push(enu[i]);

    return arr;
};
Utilities.unique = unique = function(arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    for(var i = 0; i < arr.length;) {
        var a = arr.splice(i, 1);
        if(!Utilities.inArray(a[0], arr, equal)) {
            arr.splice(i, 0, a[0]);
            i++;
        }
    }
    return arr;
};
Utilities.inArray = inArray = function(k, arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    return (function check(i) {
        if(i >= arr.length)
            return false;
        if(equal === true && arr[i] === k)
            return true;
        if(equal === false && arr[i] == k)
            return true;
        return check(i + 1);
    }(0));
};
Utilities.nsort = nsort = function(arr, asc) {
    asc = Utilities.isBoolean(asc) ? asc : true;
    arr.sort(function(x, y) {
        return asc?parseFloat(x)-parseFloat(y):parseFloat(y)-parseFloat(x);
    });
    return arr;
};
/**
 * @api public
 */
Utilities.isArray = isArray = function(a) {
    return Object.prototype.toString.call(a) === '[object Array]' && a instanceof Array;
};
/**
 * @api public
 */
Utilities.isRegExp = isRegExp = function(r) {
    return Object.prototype.toString.call(r) === '[object RegExp]' && r instanceof RegExp;
};
/**
 * @api public
 */
Utilities.isDate = isDate = function(d) {
    return Object.prototype.toString.call(d) === '[object Date]' && d instanceof Date;
};
/**
 * @api public
 */
Utilities.isError = isError = function(e) {
    return Object.prototype.toString.call(e) === '[object Error]' && e instanceof Error;
};
/**
 * @api public
 */
Utilities.isString = isString = function(str) {
    return 'string' === typeof str ? true : false;
};
/**
 * @api public
 */
Utilities.isNumber = isNumber = function(num) {
    return 'number' === typeof num ? true : false;
};
/**
 * @api public
 */
Utilities.isBoolean = isBoolean = function(bool) {
    return 'boolean' === typeof bool ? true : false;
};
/**
 * @api public
 */
Utilities.isObject = isObject = function(obj) {
    return 'object' === typeof obj ? true : false;
};
/**
 * @api public
 */
Utilities.isPureObject = isPureObject = function(o) {
    return o !== undefined && o !== null && !Utilities.isFunction(o) && !Utilities.isString(o)
            && !Utilities.isNumber(o) && !Utilities.isBoolean(o) && !Utilities.isArray(o) && !Utilities.isDate(o)
            && !Utilities.isRegExp(o) && !Utilities.isError(o);
};
/**
 * @api public
 */
Utilities.isA = isA = function(o, O) {
    return Utilities.isFunction(O) && o instanceof O ? true : false;
};
/**
 * @api public
 */
Utilities.isDefined = isDefined = function(o) {
    return 'undefined' !== typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isUndefined = isUndefined = function(o) {
    return 'undefined' === typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isInteger = isInteger = function(n) {
    return 'number' === typeof n && n % 1 === 0 ? true : false;
};
/**
 * @api public
 */
Utilities.isFloat = isFloat = function(n) {
    return 'number' === typeof n && n !== parseInt(n, 10) && !isNaN(n) ? true : false;
};
/**
 * @api public
 */
Utilities.isBinary = isBinary = function(bin) {

};
/**
 * @api public
 */
Utilities.isFunction = isFunction = function(f) {
    return 'function' === typeof f ? true : false;
};
/**
 * @api public
 */
Utilities.isNull = isNull = function(n) {
    return n === null ? true : false;
};
/**
 * @api public
 */
Utilities.isEmpty = isEmpty = function(o) {
    if(o === undefined || o === null)
        return true;
    if(Utilities.isArray(o) && o.length === 0)
        return true;
    if(Utilities.isString(o) && o.length === 0)
        return true;
    if(Utilities.isPureObject(o) && Object.keys(o).length === 0)
        return true;
    return false;
};
/**
 * 
 */
function Async() {
    this.fns = [];
    this.rets = [];
}
/**
 * 
 * @param {Function} method
 * @param {Array} args must be set,the arguments before callback function
 * @param {Object} obj optional
 * @param {Function} fn the callback function,it will replace the method's callback
 * @param {Array} arge arguments after callback function
 */
Async.prototype.push = function(method, args, obj, fn, arge) {
    var fns = this.fns;
    var argus = Array.prototype.slice.call(arguments, 0);
    method = argus.length ? argus.shift() || {} : {};
    args = argus.length ? argus.shift() || [] : [];
    args = $util.isArray(args)?args:[];
    if($util.isFunction(obj)) {
        fn = obj;
        arge = fn;
        obj = null;
    } else {
        obj = argus.length ? argus.shift() || null : null;
    }
    
    fns.push({
        method:method,
        args:args,
        obj:obj,
        fn:fn,
        arge:arge
    });
};
Async.prototype.exec = function(opts, callback) {
    var fns = this.fns;
    var rets = this.rets;
    var i = 0;
    var defaults = {
        auto:true//auto create a callback function
    };
    
    if($util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if($util.isPureObject(opts)) {
        opts = $util.extend(defaults, opts);
    }
    
    var once = function() {
        var afn = $util.clone(fns[i]);
        var ret, go = true;
        if($util.isFunction(afn.fn) || opts.auto) {
            afn.args.push(function() {
                rets[i] = ret = $util.toArray(arguments);
                i++;
                
                if($util.isFunction(afn.fn)) {
                    go = afn.fn.apply(afn.fn, ret);
                }
                if($util.isNumber(go)) {
                    i += go;
                }
                
                if(!$util.isEmpty(fns[i]) && go !== false) {
                    once();
                } else {
                    $util.isFunction(callback) && callback.apply(callback, rets);
                }
            });
            if(!$util.isEmpty(afn.arge) && $util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    afn.args.push(arg);
                });
            }
            if($util.isEmpty(afn.obj) && $util.isFunction(afn.method)) {
                afn.method.apply(afn.method, afn.args);
            } else if($util.isObject(afn.obj) && $util.isFunction(afn.method)) {
                afn.method.apply(afn.obj, afn.args);
            } else if($util.isObject(afn.obj) && $util.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, afn.args);
            }
        } else {
            if(!$util.isEmpty(afn.arge) && $util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    afn.args.push(arg);
                });
            }
            if($util.isEmpty(afn.obj) && $util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, afn.args);
            } else if($util.isObject(afn.obj) && $util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, afn.args);
            } else if($util.isObject(afn.obj) && $util.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, afn.args);
            }
            i++;
            
            if(fns[i]) {
                once();
            } else {
                $util.isFunction(callback) && callback.apply(callback, rets);
            }
            
        }
    };
    once();
};
/**
 * 顺序执行所有方法或函数，且上一个方法或函数的回调结果将作为参数传递给下一个方法或函数
 * 
 * @param callback
 */
Async.prototype.sync = function(args, opts, callback) {
    var fns = this.fns;
    var rets = this.rets;
    var i = 0;
    var defaults = {
        auto:true
    };
    
    if($util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if($util.isPureObject(opts)) {
        opts = $util.extend(defaults, opts);
    }
    
    var once = function(args) {
        var afn = $util.clone(fns[i]);
        var ret, go = true;
        //afn.args is unuseful
        args = $util.toArray(args);
        if($util.isFunction(afn.fn) || opts.auto) {
            args.push(function() {
                rets[i] = ret = $util.toArray(arguments);
                if($util.isFunction(afn.fn)) {
                    go = afn.fn.apply(afn.fn, ret);
                }
                i++;
                
                if(!$util.isEmpty(fns[i]) && go !== false) {
                    once.call(once, ret);
                } else {
                    $util.isFunction(callback) && callback.apply(callback, rets);
                }
            });
            if(!$util.isEmpty(afn.arge) && $util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    args.push(arg);
                });
            }
            if($util.isEmpty(afn.obj) && $util.isFunction(afn.method)) {
                afn.method.apply(afn.method, args);
            } else if($util.isObject(afn.obj) && $util.isFunction(afn.method)) {
                afn.method.apply(afn.obj, args);
            } else if($util.isObject(afn.obj) && $util.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, args);
            }
        } else {
            if($util.isEmpty(afn.obj) && $util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, args);
            } else if($util.isObject(afn.obj) && $util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, args);
            } else if($util.isObject(afn.obj) && $util.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, args);
            }
            i++;
            
            if(fns[i]) {
                once.call(once, isArray(ret)?ret:[ret]);
            } else {
                $util.isFunction(callback) && callback.apply(callback, rets);
            }
        }
    };
    once(args);
};


function Pnotify() {
}
/**
 * @api private
 */
Pnotify._alert = undefined;
/**
 * @api public
 */
Pnotify.consume_alert = function() {
    if(!$util.isEmpty(Pnotify._alert))
        return;
    Pnotify._alert = window.alert;
    window.alert = function(message) {
        $.pnotify({
            title : 'Alert',
            styling : 'jqueryui',
            text : message
        });
    };
};
/**
 * @api public
 */
Pnotify.release_alert = function() {
    if($util.isEmpty(Pnotify._alert))
        return;
    window.alert = Pnotify._alert;
    Pnotify._alert = undefined;
};

/**
 * 后续还需要根据rfc2822进行修改
 */
function Message(content, headers) {
    var _content = '', _headers = {};

    if($util.isObject(content) && !$util.isNull(content)) {
        var tmp = content;
        content = tmp.content;
        headers = tmp.headers;
    }

    // 一些setter和getter方法
    this.__defineSetter__('content', function(content) {
        if($util.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if($util.isObject(headers) && !$util.isNull(headers))
            _headers = headers;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.headers = headers;
    this.content = content;
}
Message.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
Message.prototype.setContent = function(content) {
    this.content = content;
};
Message.prototype.getHeaders = function() {
    return this.headers;
};
Message.prototype.getContent = function() {
    return this.content;
};
/**
 * 后续还需要根据rfc2822进行修改
 */
function MessageField(key, value) {
    var _key = '', _value = '';
    var keys = ['Resent-From', 'Resent-To', 'Resent-Date', 'Resent-From', 'Resent-Message-ID', 'Reply-To',
            'In-Reply-To', 'References', 'Received', 'From', 'Sender', 'To', 'Cc', 'Bcc', 'Subject', 'Comments', 'Keywords',
            'Date', 'Message-ID'];

    if($util.isObject(key) && !$util.isNull(key)) {
        var tmp = key;
        key = tmp.key;
        value = tmp.value;
    }

    // 一些setter和getter方法
    this.__defineSetter__('key', function(key) {
        if($util.isString(key) && $util.inArray(key, keys))
            _key = key;
    });
    this.__defineSetter__('value', function(value) {
        if($util.isString(value))
            _value = value;
    });
    this.__defineGetter__('key', function() {
        return _key;
    });
    this.__defineGetter__('value', function() {
        return _value;
    });

    this.key = key;
    this.value = value;
}
MessageField.prototype.setKey = function(key) {
    this.key = key;
};
MessageField.prototype.setValue = function(value) {
    this.value = value;
};
MessageField.prototype.getKey = function() {
    return this.key;
};
MessageField.prototype.getValue = function() {
    return this.value;
};
