
function index(req, res, callback) {
    var url = require('url');
    var _path = url.parse(req.url,true).pathname.substr(1);
    var _cmd = req._cmd = _path.replace('/', '_');
    if(!_cmd) {
        res.json({isok:false, code:$.error.INVALID_CMD.code, data:$.error.INVALID_CMD.message});
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.web, req, res, callback);
    }
}

module.exports = exports = index;
