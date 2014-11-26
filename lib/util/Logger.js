/**
 * copy from socket.io-node
 */
var moment = require('moment');
var util = require('util');

/**
 * Logger (console).
 * 
 * @api public
 */
function Logger(opts) {
    opts = opts || {};
    Logger = util.extend(Logger, opts);
    return Logger;
}

module.exports = exports = Logger;

/**
 * Log levels.
 */
Logger.levels = ['error', 'warn', 'info', 'debug'];
/**
 * Colors for log levels.
 */
Logger.colors = [31, 33, 36, 90];
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
/**
 * Log method.
 * 
 * @api public
 */
Logger.log = function(type) {
    var index = Logger.levels.indexOf(type);
    var time = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

    if(index >= Logger.levels.length || !Logger.enabled) return;

    console.log.apply(console, [Logger.color ? '   \033[' + Logger.colors[index]
            + 'm' + Logger.pad(type, Logger.levels) + ' ' + time + '\033[39m' : type + ':'].concat(Logger.toArray(arguments).slice(1)));

    return;
};

/**
 * Generate methods.
 */
Logger.levels.forEach(function(name) {
    Logger[name] = function() {
        Logger.log.apply(null, [name].concat(Logger.toArray(arguments)));
    };
});

//Logger.logger = global.$logger = global.$logger || new Logger();
