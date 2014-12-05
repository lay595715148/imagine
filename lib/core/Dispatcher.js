
function Dispatcher() {
}

module.exports = exports = Dispatcher;

Dispatcher.classname = 'core.Dispatcher';
Dispatcher.run = function run(cmd, space, req, res, callback) {
    var action = Dispatcher.gen(cmd, space, req, res);
    if(action) {
        setTimeout(function() {
            action.run(callback);
        }, 0);
    } else {
        //res.json({isok:false, code:$.error.UNSUPPORTED_CMD.code, data:$.error.UNSUPPORTED_CMD.message});
        res.json($.data.Response.incorrectResponse(new UnsupportedCmdException()));
        callback && callback();
    }
};

Dispatcher.gen = function gen(cmd, space, req, res) {
    cmd = cmd || '';
    var speices = cmd.split('_');
    var i = 0, index;
    $.Log.info(speices);
    for(; i < speices.length; i++) {
        if(i + 1 == speices.length) {
            index = $.Util.ucfirst(speices[i]);
        } else {
            index = speices[i];
        }
        if(space[index]) {
            space = space[index];
        } else {
            return false;
        }
    }
    return new space(cmd, req, res);
};

Dispatcher.runByClass = function runByClass(clazz, req, res, callback) {

};

/**
 * 内部类UnsupportedCmdException
 */
function UnsupportedCmdException() {
    $.core.Exception.call(this, $.error.UNSUPPORTED_CMD.message, $.error.UNSUPPORTED_CMD.code);
    this.classname = 'core.Dispatcher.UnsupportedCmdException';
};

$.Util.inherits(UnsupportedCmdException, $.core.Exception);
