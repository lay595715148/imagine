/**
 * 
 */
function Async() {
    this.fns = [];
    this.rets = [];
}

module.exports = exports = Async;

Async.classname = 'util.Async';
/**
 * 
 * @param {Function} method
 * @param {Array} args must be set,the arguments before callback function
 * @param {Object} obj optional
 * @param {Function} fn the callback function,it will replace the method's callback
 * @param {Array} arge arguments after callback function
 */
Async.prototype.push = function(method, args, obj, fn, arge) {
    var argus = [].slice.call(arguments, 0);
    method = argus.length ? argus.shift() || {} : {};
    args = argus.length ? argus.shift() || [] : [];
    args = $.Util.isArray(args)?args:[];
    if($.Util.isFunction(obj)) {
        fn = obj;
        arge = fn;
        obj = null;
    } else {
        obj = argus.length ? argus.shift() || null : null;
    }
    
    this.fns.push({
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
    
    if($.Util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if($.Util.isPureObject(opts)) {
        opts = $.Util.extend(defaults, opts);
    }
    //var once = 
    (function once() {
        var afn = $.Util.clone(fns[i]);
        var ret, go = true;
        if($.Util.isFunction(afn.fn) || opts.auto) {
            afn.args.push(function() {
                rets[i] = ret = $.Util.toArray(arguments);
                i++;
                
                if($.Util.isFunction(afn.fn)) {
                    go = afn.fn.apply(afn.fn, ret);
                }
                if($.Util.isNumber(go)) {
                    i += go;
                }
                
                if(!$.Util.isEmpty(fns[i]) && go !== false) {
                    once();
                } else {
                    $.Util.isFunction(callback) && callback.apply(callback, rets);
                }
            });
            if(!$.Util.isEmpty(afn.arge) && $.Util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    afn.args.push(arg);
                });
            }
            if($.Util.isEmpty(afn.obj) && $.Util.isFunction(afn.method)) {
                afn.method.apply(afn.method, afn.args);
            } else if($.Util.isObject(afn.obj) && $.Util.isFunction(afn.method)) {
                afn.method.apply(afn.obj, afn.args);
            } else if($.Util.isObject(afn.obj) && $.Util.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, afn.args);
            }
        } else {
            if(!$.Util.isEmpty(afn.arge) && $.Util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    afn.args.push(arg);
                });
            }
            if($.Util.isEmpty(afn.obj) && $.Util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, afn.args);
            } else if($.Util.isObject(afn.obj) && $.Util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, afn.args);
            } else if($.Util.isObject(afn.obj) && $.Util.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, afn.args);
            }
            i++;
            
            if(fns[i]) {
                once();
            } else {
                $.Util.isFunction(callback) && callback.apply(callback, rets);
            }
            
        }
    })();
    //once();
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
    
    if($.Util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if($.Util.isPureObject(opts)) {
        opts = $.Util.extend(defaults, opts);
    }
    
    //var once = 
    (function once(args) {
        var afn = $.Util.clone(fns[i]);
        var ret = null, go = true;
        //afn.args is unuseful
        args = $.Util.toArray(args);
        if($.Util.isFunction(afn.fn) || opts.auto) {
            args.push(function() {
                rets[i] = ret = $.Util.toArray(arguments);
                if($.Util.isFunction(afn.fn)) {
                    go = afn.fn.apply(afn.fn, ret);
                }
                i++;
                
                if(!$.Util.isEmpty(fns[i]) && go !== false) {
                    once.call(once, ret);
                } else {
                    $.Util.isFunction(callback) && callback.apply(callback, rets);
                }
            });
            if(!$.Util.isEmpty(afn.arge) && $.Util.isArray(afn.arge)) {
                afn.arge.forEach(function(arg) {
                    args.push(arg);
                });
            }
            if($.Util.isEmpty(afn.obj) && $.Util.isFunction(afn.method)) {
                afn.method.apply(afn.method, args);
            } else if($.Util.isObject(afn.obj) && $.Util.isFunction(afn.method)) {
                afn.method.apply(afn.obj, args);
            } else if($.Util.isObject(afn.obj) && $.Util.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, args);
            }
        } else {
            if($.Util.isEmpty(afn.obj) && $.Util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, args);
            } else if($.Util.isObject(afn.obj) && $.Util.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, args);
            } else if($.Util.isObject(afn.obj) && $.Util.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, args);
            }
            i++;
            
            if(fns[i]) {
                once.call(once, $.Util.isArray(ret)?ret:[ret]);
            } else {
                $.Util.isFunction(callback) && callback.apply(callback, rets);
            }
        }
    })();
    //once(args);
};
Async.prototype.auto = function auto(fns, args, fn) {
    var argus = [].slice.call(arguments, 0);
    fns = argus.length ? argus.shift() : {};
    fn = argus.length ? argus.pop() : function() {};
    args = argus.length ? argus.shift() : [];
    if($.Util.isPrueObject(fns)) {
        
    }
};
