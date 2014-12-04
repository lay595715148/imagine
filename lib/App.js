
function App() {
    this.classname = 'App';
}
/**
 * WEB接口
 * @param req
 * @param res
 * @param callback
 */
App.web = function web(req, res, callback) {
    var url = require('url');
    var _path = url.parse(req.url,true).pathname.substr(1);
    var _cmd = req._cmd = _path.replace('/', '_');
    if(!_cmd) {
        //res.json({isok:false, code:$.error.INVALID_CMD.code, data:$.error.INVALID_CMD.message});
        res.json($.data.Response.incorrectResponse(new InvalidCmdException()));
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.web, req, res, callback);
    }
};
/**
 * JSON API接口
 * @param req
 * @param res
 * @param callback
 */
App.api = function api(req, res, callback) {
    var _get = req._get = req.query || {};
    var _post = req._post = req.body || {};
    var _request = req._request = $.Util.extend($.Util.clone(_get), $.Util.clone(_post));
    var _json = req._json = _request.json ? $.Util.toJson(_request.json) : {};
    var _cmd = req._cmd = _json.cmd || '';
    if(!_json || $.Util.isEmpty(_json)) {
        res.json($.data.Response.incorrectResponse(new InvalidJsonException()));
        callback && callback();
    } else if(!_cmd) {
        res.json($.data.Response.incorrectResponse(new InvalidCmdException()));
        callback && callback();
    } else {
        $.core.Dispatcher.run(_cmd, $.json, req, res, callback);
    }
};
/**
 * TEST接口
 * @param req
 * @param res
 * @param api_url
 * @param callback
 */
App.test = function test(req, res, api_url, callback) {
    //var _path = url.parse(req.url,true).pathname.substr(1);
    var _get = req.query || {};
    var _post = req.body || {};
    var _request = $.Util.extend($.Util.clone(_get), $.Util.clone(_post));
    var cmd = _request.cmd ? _request.cmd : '';
    var json = {
        sid : '',
        cmd : cmd,
        headers : {},
        data : {}
    };
    
    if(cmd == 'user_login') {
        json.data = {
            username : 'username',
            password : 'password'
        };
    } else {
        
    }
    
    var options = {
        url : api_url,
        form : {
            json : JSON.stringify(json)
        }
    };

    $.Log.info('JSON : <---');
    $.Log.info(JSON.stringify(json));
    $.Log.info('JSON : --->');
    $.Log.info('REQUEST : <---');
    $.request.post(options, function(err, rsp, body) {
        $.Log.info('Error : ');
        $.Log.info(err);
        //$.Log.info('Response:');
        //$.Log.info(rsp);
        $.Log.info('Body : ');
        $.Log.info(body);
        if(err) {
            res.json({isok:false, error:err});
        } else {
            res.send(body);
            res.end();
        }
        $.Log.info('REQUEST : --->');
        callback && callback();
    });
};

module.exports = exports = App;

/**
 * 内部类InvalidCmdException
 */
function InvalidCmdException() {
    $.core.Exception.call(this, $.error.INVALID_CMD.message, $.error.INVALID_CMD.code);
    this.classname = 'App.InvalidCmdException';
}

$.Util.inherits(InvalidCmdException, $.core.Exception);

/**
 * 内部类InvalidJsonException
 */
function InvalidJsonException() {
    $.core.Exception.call(this, $.error.INVALID_JSON.message, $.error.INVALID_JSON.code);
    this.classname = 'App.InvalidJsonException';
}

$.Util.inherits(InvalidJsonException, $.core.Exception);
