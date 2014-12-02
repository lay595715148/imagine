
function api(req, res, callback) {
    var _get = req._get = req.query || {};
    var _post = req._post = req.body || {};
    var _request = req._request = $.Util.extend($.Util.clone(_get), $.Util.clone(_post));
    var _json = req._json = _request.json ? $.Util.toJson(_request.json) : {};
    var _cmd = req._cmd = _json.cmd || '';
    if(!_json || $.Util.isEmpty(_json)) {
        res.json({isok:false, code:$.error.INVALID_JSON.code, data:$.error.INVALID_JSON.message});
        callback && callback();
    } else if(!_cmd) {
        res.json({isok:false, code:$.error.INVALID_CMD.code, data:$.error.INVALID_CMD.message});
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.json, req, res, callback);
    }
}

module.exports = exports = api;
