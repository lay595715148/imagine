
/**
 * @param {String}
 *            nsp 命名空间
 * @param {Object}
 *            context 上下文
 */
function Config(nsp, context) {
    this.nsp = '';
    this.context = {};

    if($.Util.isObject(nsp)) {
        nsp = nsp.nsp;
        context = nsp.context;
    }

    this.setNamespace(nsp);
    this.setContext(context);
}

module.exports = exports = Config;

Config.classname = 'core.Config';
/**
 * 检查键
 * 
 * @api private
 * @param key
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkKey = function checkKey(key) {
    if($.Util.isArray(key)) {
        for(var i = 0; i < key.length; i++) {
            if(!this.checkKey(key[i])) {
                return false;
            }
        }
        return true;
    } else if($.Util.isString(key) || $.Util.isNumber(key)) {
        return true;
    } else {
        return false;
    }
};
/**
 * 检查值
 * 
 * @param value
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkValue = function checkValue(value) {
    if($.Util.isArray(value)) {
        for(var i = 0; i < value.length; i++) {
            if(!this.checkValue(value[i])) {
                return false;
            }
        }
        return true;
    } else if($.Util.isObject(value)) {
        for( var p in value) {
            if(!this.checkValue(value[p])) {
                return false;
            }
        }
        return true;
    } else if($.Util.isBoolean(value) || $.Util.isString(value) || $.Util.isNumber(value)
            || $.Util.isFunction(value)) {
        return true;
    } else {
        return false;
    }
};
/**
 * 检查键值对
 * 
 * @param {String} key
 * @param value
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkKeyValue = function checkKeyValue(key, value) {
    if($.Util.isArray(key)) {
        if($.Util.isArray(value)) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
};

/**
 * 设置值
 * 
 * @param {String} key 键
 * @param value 值
 * @api public
 */
Config.prototype.setValue = function setValue(key, value) {
    if(this.checkKey(key) && this.checkValue(value) && this.checkKeyValue(key, value)) {
        var me = this, node = this.context;
        if($.Util.isArray(key)) {
            key.forEach(function(k) {
                me.setValue(k, value[k]);
            });
        } else if($.Util.isString(key)) {
            var keys = key.split('.');
            var count = keys.length;
            keys.forEach(function(k, index) {
                if($.Util.isDefined(node[k]) && index === count - 1) {
                    node[k] = value;
                } else if($.Util.isDefined(node[k])) {
                    node = node[k];
                } else if(index === count - 1) {
                    node[k] = value;
                } else {
                    node[k] = {};
                    node = node[k];
                }
            });
        } else {
            node[key] = value;
        }
    } else {

    }
};
/**
 * 获取值
 * 
 * @param {String} key 键
 * @param def
 *            不存在时的默认值
 * @api public
 */
Config.prototype.getValue = function getValue(key, def) {
    var me = this, node = '';
    if(this.checkKey(key)) {
        if($.Util.isArray(key) && !$.Util.isEmpty(key)) {
            node = [];
            key.forEach(function(k, i) {
                node[i] = me.getValue(k);
            });
        } else if($.Util.isString(key)) {
            var keys = key.split('.');
            node = $.Util.clone(this.context);
            for(var i in keys) {
                if($.Util.isDefined(node) && $.Util.isDefined(node[keys[i]])) {
                    node = node[keys[i]];
                } else {
                    node = def;
                    break;
                }
            }
        } else {
            node = $.Util.clone(this.context);
            if($.Util.isDefined(node[key])) {
                node = node[key];
            } else {
                node = def;
            }
        }
    } else {
        node = $.Util.clone(this.context);
    }
    return node;
};

/**
 * 设置命名空间
 * 
 * @param {String}
 *            nsp 命名空间
 * @api private
 */
Config.prototype.setNamespace = function setNamespace(nsp) {
    if($.Util.isString(nsp) || $.Util.isNumber(nsp))
        this.nsp = nsp;
};
/**
 * 设置上下文
 * 
 * @param {Object}
 *            context 上下文
 * @api private
 */
Config.prototype.setContext = function setContext(context) {
    if($.Util.isObject(context))
        this.context = $.Util.extend(this.context, context);
};

/**
 * 全局数据实例池，
 * 
 * @api private
 */
Config.instances = {};
/**
 * 默认设置值，命名空间为是''
 * 
 * @param {String}
 *            key
 * @param value
 * @api public
 */
Config.set = function set(key, val) {
    Config.of('').setValue(key, val);
};
/**
 * 默认获取值，命名空间为是''
 * 
 * @param {String}
 *            key 键
 * @param def 如果是undefined时使用此值
 * @api public
 */
Config.get = function get(key, def) {
    return Config.of('').getValue(key, def);
};
/**
 * 
 * @param {String}
 *            nsp 命名空间，默认''
 * @returns {Config}
 * @api public
 */
Config.of = function of(nsp) {
    if(!$.Util.isString(nsp) && !$.Util.isNumber(nsp)) {
        nsp = '';
    }
    if(!Config.instances[nsp]) {
        Config.instances[nsp] = new Config(nsp);
    }

    return Config.instances[nsp];
};
/**
 * 配置
 * 
 * @param {Object}
 *            opts 选项，可选。文件名或文件夹是绝对路径
 * @param {Function}
 *            callback 回调函数，可选
 * @api public
 */
Config.configure = function configure(opts, callback) {
    var fs = require('fs');
    var path = require('path');
    // 默认项
    var defaults = {
        'file' : undefined,
        'dir' : undefined,
        'nsp' : '',
        'append' : true
    };

    // opts为可选项
    if($.Util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if($.Util.isString(opts)) {
        //fs.existsSync(opts);
        if(fs.existsSync(opts)) {
            var _stat = fs.lstatSync(opts);
            if(_stat.isDirectory()) {
                opts = $.Util.extend(defaults, {dir:opts, file:undefined});
            } else if(_stat.isFile()) {
                opts = $.Util.extend(defaults, {file:$.path.resolve(opts), dir:undefined});
            }
        }
    } else if($.Util.isArray(opts)) {
        //fs.existsSync(opts);
        var files = [];
        var dirs = [];
        opts.forEach(function(f) {
            if(fs.existsSync(f)) {
                var _stat = fs.lstatSync(f);
                if(_stat.isDirectory()) {
                    dirs.push(f);
                } else if(_stat.isFile()) {
                    files.push($.path.resolve(f));
                }
            }
        });
        opts = $.Util.extend(defaults, {file:files, dir:dirs});
    } else {
        opts = $.Util.extend(defaults, opts);
    }

    // 加载配置目录，不包括子目录
    if(!$.Util.isEmpty(opts.dir)) {
        if($.Util.isArray(opts.dir)) {
            //多文件夹时
            opts.dir.forEach(function(d) {
                Config.configure($.Util.extend(opts,{
                    'dir' : d,
                    'file' : undefined
                }));
            });
        } else if($.Util.isString(opts.dir)) {
            if(fs.existsSync(opts.dir)) {
                var files = fs.readdirSync(opts.dir);
                var dir = fs.realpathSync(opts.dir);
                files.forEach(function(f) {
                    Config.configure($.Util.extend(opts, {
                        'dir' : undefined,
                        'file' : $.path.resolve(dir + '/' + f)
                    }));
                });
            }
        }
    }
    // 加载配置文件
    if(!$.Util.isEmpty(opts.file)) {
        // 多个文件
        if($.Util.isArray(opts.file)) {
            opts.file.forEach(function(f) {
                Config.configure($.Util.extend(opts, {
                    'dir' : undefined,
                    'file' : $.path.resolve(f)
                }));
            });
        } else if($.Util.isString(opts.file)) {
            // 检查是不是json文件
            var _ext = path.extname(opts.file);
            var exts = require.extensions;
            if(fs.existsSync(opts.file) && $.Util.inArray(_ext, Object.keys(exts))) {
                //$.Log.info('load config: ' + opts.file);
                var str = fs.readFileSync(opts.file, {
                    'flag' : 'r',
                    'encoding' : 'utf-8'
                });
                var json = !$.Util.isError(str) && str ? $.Util.toJson(str) : false;
                //var json = require(opts.file);

                if($.Util.isPureObject(json)) {
                    // 是否设置了命名空间，默认是''
                    var context = json;
                    var nsp = opts.nsp;
                    var append = opts.append;
                    if($.Util.isPureObject(context)) {
                        for( var key in context) {
                            if(append !== false) {
                                Config.iteration(key, context[key], nsp);
                            } else {
                                Config.of(nsp).set(key, context[key]);
                            }
                        }
                    } else {
                        // 不是object不执行
                    }
                }
            }
        }
    }
    // 回调函数
    if($.Util.isFunction(callback)) {
        callback(Config, opts);
    }
};

/**
 * 迭代配置赋值
 * 
 * @api private
 * @param {String} key 键名
 * @param {Object} context 内容
 * @param {String} nsp 命名空间
 */
Config.iteration = function iteration(key, context, nsp) {
    if(!$.Util.isString(nsp) && !$.Util.isNumber(nsp))
        nsp = '';

    var exists = Config.of(nsp).getValue(key);
    if($.Util.isUndefined(exists) || (!$.Util.isArray(exists) && !$.Util.isObject(exists))) {
        Config.of(nsp).setValue(key, context);
    } else if($.Util.isArray(exists) && $.Util.isArray(context)) {
        var len = exists.length;
        context.forEach(function(item, index) {
            Config.iteration(key + '.' + len++, item, nsp);
        });
    } else if($.Util.isObject(exists) && $.Util.isObject(context)) {
        for( var p in context) {
            Config.iteration(key + '.' + p, context[p], nsp);
        }
    } else {
        Config.of(nsp).setValue(key, context);
    }
};
