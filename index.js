
function index(req, res, callback) {
    var url = require('url');
    var _path = url.parse(req.url,true).pathname.substr(1);
    var _cmd = req._cmd = _path.replace('/', '_');
    if(!_cmd) {
        res.json({isok:false, code:100002, data:$.get('errors.' + 100002)});
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.web, req, res, callback);
    }
}

module.exports = exports = index;
