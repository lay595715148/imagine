/* jshint eqeqeq: false */
/* global $ */
"use strict";

/**
 * Logger (console).
 * 
 * @api public
 */
function Logger(opts) {
    var util = require('util');
    
    opts = opts || {};
    Logger = util.extend(Logger, opts);
    return Logger;
}

module.exports = exports = Logger;

(function() {
    var util = require('util');

    Logger.classname = 'util.Logger';
    /**
     * Log levels.
     */
    Logger.levels = ['error', 'warn', 'info', 'debug'];
    /**
     * Colors for log levels.
     */
    //Logger.colors = [31, 33, 36, 90];
    Logger.colors = ['red', 'yellow', 'cyan', 'grey'];
    Logger.color = true;
    Logger.level = 3;
    Logger.enabled = true;
    Logger.option = function(opts) {
        opts = opts || {};
        Logger = util.extend(Logger, opts);
        return Logger;
    };
    Logger.toArray = function(enu) {
        return [].slice.call(enu, 0);
    };
    /**
     * Pads the nice output to the longest log level.
     */
    Logger.pad = function (str, levels) {
        var max = 0;

        for(var i = 0, l = levels.length; i < l; i++)
            max = Math.max(max, levels[i].length);

        if(str.length < max)
            return str + new Array(max - str.length + 1).join(' ');

        return str;
    };
    Logger.useScribe = function() {
        $.factory('store.ScribeStore').replaceConsole();
    };
    Logger.cancelScribe = function() {
        $.factory('store.ScribeStore').releaseConsole();
    };
    /**
     * Log method.
     * 
     * @api public
     */
    Logger.log = function(type) {
        var index = Logger.levels.indexOf(type);
        var color = Logger.colors[index];
        var time = $.moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        var prefix = $.colors[color]('   ' + Logger.pad(type, Logger.levels) + ' ' + time);
        var called = $.Util.extractCalledFromStack();

        if(index >= Logger.levels.length || !Logger.enabled) {

        } else {
            console.log.apply(console, [prefix, called].concat(Logger.toArray(arguments).slice(1)));
            //$.Scribe && $.Scribe.log('imagine_' + type, [prefix, called].concat(Logger.toArray(arguments).slice(1)).join(' '));
        }
    };

    /**
     * Generate methods.
     */
    Logger.levels.forEach(function(name) {
        Logger[name] = function() {
            Logger.log.apply(null, [name].concat(Logger.toArray(arguments)));
        };
    });
})();
