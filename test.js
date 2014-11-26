var request = require('request');
var _ = require('underscore');
var path = require('path');

function test(req, res, api_url, callback) {
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
    request.post(options, function(err, rsp, body) {
        $.Log.info('Error : ');
        $.Log.info(err);
        //$.Log.info('Response:');
        //$.Log.info(rsp);
        $.Log.info('Body : ');
        $.Log.info(body);
        if(err) {
            res.json({rsp:0, data:err});
        } else {
            res.send(body);
            res.end();
        }
        $.Log.info('REQUEST : --->');
        callback && callback();
    });
}

module.exports = exports = test;