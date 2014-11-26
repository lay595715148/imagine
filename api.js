
function api(req, res, callback) {
    var _get = req._get = req.query || {};
    var _post = req._post = req.body || {};
    var _request = req._request = $.Util.extend($.Util.clone(_get), $.Util.clone(_post));
    var _json = req._json = _request.json ? $.Util.toJson(_request.json) : {};
    var _cmd = req._cmd = _json.cmd || '';
    if(!_json || $.Util.isEmpty(_json)) {
        res.json({isok:false, code:100001, data:$.get('errors.' + 100001)});
        callback && callback();
    } else if(!_cmd) {
        res.json({isok:false, code:100002, data:$.get('errors.' + 100002)});
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.json, req, res, callback);
    }
}

module.exports = exports = api;
