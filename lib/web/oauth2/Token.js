
function Token() {
    $.core.Htmler.apply(this, arguments);
    this.classname = 'web.oauth2.Token';
}

$.Util.inherits(Token, $.core.Htmler);

module.exports = exports = Token;

Token.prototype.onGet = function onGet(fn, rs) {
    var scope = this.scope;
    /*this.template.push(request);
    this.template.template('token.jade');
    this.template.display();*/
    this.assign(scope.request());
    this.template = 'token.jade';
    this._super_('onGet', fn, rs);
};
Token.prototype.onPost = function onPost(fn, rs) {
    var me = this;
    var oservice = $.factory('service.OAuth2Service');
    var cservice = $.factory('service.ClientService');
    var uservice = $.factory('service.UserService');
    var codeservice = $.factory('service.OAuth2CodeService');
    var tservice = $.factory('service.OAuth2TokenService');
    var scope = this.scope;
    var use_refresh_token = $.get('oauth2.use_refresh_token') ? true : false;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var request_type = oservice.getRequestType(scope);
    var clientId = request.client_id;
    var redirectURI = request.redirect_uri;
    var clientSecret = request.client_secret;
    var clientType = request_type == 'token' ? 1 : request_type == 'password' ? 2 : false;
    var code = request.code;
    var refresh_token = request.refresh_token;
    var username = request.username;
    var password = request.password;
    var query;
    var async = new $.util.Async();
    /**
     * 失败响应
     */
    var failure = function(msg, code) {
        me.template.push(Collector.response(false, me.name, msg, code));
        me.template.json();
        me.super('onPost');
    };
    /**
     * 成功响应
     */
    var success = function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
        me.super('onPost');
    };
    /**
     * 生成令牌码回调函数
     */
    var genToken = function(ret) {
        if(ret) {
            if(use_refresh_token && request_type != 'refresh_token') {
                ret.map(function(r, i) {
                    ret[i] = r.toOAuth2TokenSummary();
                });
                success(ret);
            } else {
                success(ret.toOAuth2TokenSummary());
            }
        } else {
            failure('invalid_gant');
        }
    };
    /**
     * 检测授权码回调函数
     */
    var checkCode = function(ret) {
        if(ret && ret.clientId == clientId && ret.redirectURI == redirectURI) {
            //打开生成token任务
            async.push(tservice.gen, [clientId, ret.userid, use_refresh_token], tservice, genToken);
        } else {
            failure('invalid_gant');
        }
    };
    /**
     * 检测刷新令牌码回调函数
     */
    var checkToken = function(ret) {
        if(ret && ret.clientId == clientId && ret.type == 2) {
            //打开生成token任务
            async.push(tservice.gen, [clientId, ret.userid, false], tservice, genToken);
        } else {
            failure('invalid_grant');
        }
    };
    /**
     * 检测登录用户回调函数
     */
    var checkUser = function(ret) {
        if(ret) {
            session.userid = ret.id;
            session.username = ret.name;
            //打开生成token任务
            async.push(tservice.gen, [clientId, session.userid, use_refresh_token], tservice, genToken);
        } else {
            failure('invalid_grant');
        }
    };
    /**
     * 检测登录客户端回调函数
     */
    var checkClient = function(ret) {
        if(ret) {
            if(request_type == 'token' && code) {
                //打开检测授权码任务
                async.push(codeservice.checkCode, [code], codeservice, checkCode);
            } else if(request_type == 'password' && username && password) {
                //打开检测登录用户任务
                async.push(uservice.checkUser, [username, password], uservice, checkUser);
            } else if(request_type == 'refresh_token' && refresh_token) {
                //打开检测刷新令牌码任务
                async.push(tservice.checkToken, [refresh_token], tservice, checkToken);
            } else {
                failure('invalid_gant');
            }
        } else {
            failure('invalid_client');
        }
    };
    /**
     * 检测请求参数
     */
    var checked = oservice.checkRequest(scope, request_type);
    
    if(checked) {
        if(clientType !== false) {
            query = {clientId:clientId, clientSecret:clientSecret, redirectURI:redirectURI, clientType:clientType};
        } else {
            query = {clientId:clientId, clientSecret:clientSecret, redirectURI:redirectURI};
        }
        
        //打开检测登录客户端任务
        async.push(cservice.checkClient, [query], cservice, checkClient);
        async.exec();
    } else {
        failure('invalid_request');
    }
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Token.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
