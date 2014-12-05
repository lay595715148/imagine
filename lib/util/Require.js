var path = require('path');
var fs = require('fs');
var util = require('util');

/**
 * @api private
 */
function inArray(k, arr, equal) {
    equal = 'boolean' === typeof equal ? equal : true;
    return (function check(i) {
        if(i >= arr.length)
            return false;
        if(equal === true && arr[i] === k)
            return true;
        if(equal === false && arr[i] == k)
            return true;
        return check(i+1);
    }(0));
}
/**
 * @api private
 */
function Require(modulename) {
    return require(modulename);
}

module.exports = exports = Require;

Require.classname = 'util.Require';
/**
 * @api private
 */
Require.require = function(classname) {
    var basepath = path.resolve(__dirname, '../');
    if('string' === typeof classname) {
        var exts = require.extensions;
        var pieces = classname.split('.');
        var arr = [];
        arr.push.call(arr, basepath);
        arr.push.apply(arr, pieces);
        var rpath = path.resolve.apply(this, arr);
        for(var ext in exts) {
            var whole = rpath + ext;
            if(fs.existsSync(whole)) {
                return require(rpath);
            }
        }
        return false;
    } else {
        return false;
    }
};
/**
 * @api private
 */
Require.define = function define(space, dirpath) {
    var log = require('./Logger');
    if(util.isArray(dirpath)) {
        var _paths = dirpath;
        _paths.map(function(_path) {
            Require.define(space, _path);
        });
    } else {
        var _path = dirpath;
        var _exists = fs.existsSync(_path);
        if(_exists) {
            //file
            var _stat = fs.lstatSync(_path);
            if(_stat && _stat.isDirectory()) {
                var _files = fs.readdirSync(_path);
                _files.map(function(f) {
                    var _pa= path.resolve(_path, f);
                    var _st = fs.lstatSync(_pa);
                    if(_st && _st.isDirectory()) {
                        space[f] = space[f] || {};
                        Require.define(space[f], _pa);
                    } else if(_st && _st.isFile()) {
                        Require.define(space, _pa);
                    }
                });
            } else if(_stat && _stat.isFile()) {
                //log.info('load module: ' + _path);
                var _ext = path.extname(_path);
                var _name = path.basename(_path, _ext);
                var _pro = _name.replace(/-/g, '_');//将一些特殊字符转换
                if(inArray(_ext, Object.keys(require.extensions))) {
                    space.__defineGetter__(_pro, function() {
                        return (function(p) {
                            return require(p);
                        })(_path.replace(/\\/g, '/'));
                    });
                }
            }
        } else {
            //log.info('load module: ' + _path);
            //module require 
            var _pro = _path.replace(/-/g, '_');
            space.__defineGetter__(_pro, function() {
                return (function(p) {
                    return require(p);
                })(_path);
            });
        }
    }
};
