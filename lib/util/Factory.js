/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Factory() {
}

module.exports = exports = Factory;

(function() {
    Factory.classname = 'util.Factory';
    Factory.instances = {};
    /**
     * @param {String}
     *            space 类实例对象存储域
     * @param {String}
     *            classname
     * @param {String}
     *            prefix 类所在文件夹前缀（包含点号或正反斜杠），如果在类实例化中还有其他参数，请设置此参数或空字符串
     */
    Factory.factory = function(classname, prefix, space) {
        var SubClass;
        var instance = null;
        var args = [].slice.call(arguments, 3);
        space = space || Factory.instances;
        prefix = $.Util.isString(prefix) ? prefix : '';
        if($.Util.isString(classname) && classname.indexOf(prefix) === 0) {
            //classname = classname.substr(prefix.length);
        } else {
            classname = prefix + classname;
        }
        if($.Util.isDefined(space[classname])) {
            //$.Log.warn('Factory.factory', prefix + classname, 'is exists');
            instance = space[classname];
        } else {
            //$.Log.warn('Factory.factory', prefix + classname, 'isn\'t exists');
            SubClass = Factory.convert(classname);
            if($.Util.isFunction(SubClass)) {
                args.unshift(SubClass);
                instance = space[classname] = $.Util.construct.apply(null, args);
            }
        }
        return instance;
    };
    Factory.convert = function(classname) {
        var node, pieces, i;
        
        if($.Util.isString(classname)) {
            node = $;
            pieces = classname.split('.');
            for(i = 0; i < pieces.length; i++) {
                if(node[pieces[i]]) {
                    node = node[pieces[i]];
                } else {
                    return false;
                }
            }
            return node;
        } else {
            return false;
        }
    };
    /**
     * @param {String}
     *            classname
     * @param {String}
     *            prefix 类所在文件夹前缀（包含点号或正反斜杠），如果在类实例化中还有其他参数，请设置此参数或空字符串
     */
    Factory.instance = function(classname, prefix) {
        var SubClass;
        var instance = null;
        var args = [].slice.call(arguments, 2);
        prefix = $.Util.isString(prefix) ? prefix : '';
        /*if($.Util.isFunction(classname)) {
            classname = $.Util.getClass(classname);
        }*/
        if($.Util.isString(classname) && classname.indexOf(prefix) === 0) {
            classname = classname.substr(prefix.length);
        }
        SubClass = $.require(prefix + classname);
        //$.Log.warn('Factory.instance', prefix + classname);
        if($.Util.isFunction(SubClass)) {
            args.unshift(SubClass);
            instance = $.Util.construct.apply(null, args);
        }
        return instance;
    };
})();
