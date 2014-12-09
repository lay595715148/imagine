
function Token() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.core.Jsonor.apply(this, arguments);
}

$.Util.inherits(Token, $.core.Jsonor);

module.exports = exports = Token;

Token.classname = 'api.oauth2.Token';
Token.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.cService = $.factory('service.ClientService');
    this.uService = $.factory('service.UserService');
    this.oService = $.factory('service.OAuth2Service');
    this.ocService = $.factory('service.OAuth2CodeService');
    this.otService = $.factory('service.OAuth2TokenService');
    this._super_('before', fn, rs);
};
Token.prototype.onGet = function onGet(fn, rs) {
    //this._super_('onGet', function() {fn($.error.INVALID_REQUEST);}, rs);return;
    return this.onPost(fn, rs);
    /*this.template.push(request);
    this.template.template('token.jade');
    this.template.display();*/
    this.assign(scope.request());
    this.template = 'token.jade';
    this._super_('onGet', function() {fn($.error.INVALID_REQUEST);}, rs);
};
Token.prototype.onPost = function onPost(fn, rs) {
    var me = this;
    var scope = this.scope;
    var use_refresh_token = $.get('oauth2.use_refresh_token') ? true : false;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var request_type = this.oService.getRequestType(scope);
    var clientId = request.client_id;
    var redirectURI = request.redirect_uri;
    var clientSecret = request.client_secret;
    var clientType = request_type == $.service.OAuth2Service.REQUEST_TYPE_TOKEN ? 1
            : request_type == $.service.OAuth2Service.REQUEST_TYPE_PASSWORD ? 2
                    : false;
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
        me.incorrectResponse(msg, code);
        me._super_('onPost', fn, rs);
    };
    /**
     * 成功响应
     */
    var success = function(ret) {
        me.correctResponse(ret);
        me._super_('onPost', fn, rs);
    };
    /**
     * 生成令牌码回调函数
     */
    var genToken = function(ret) {
        if(ret) {
            if(use_refresh_token && request_type != $.service.OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN) {
                ret.map(function(r, i) {
                    ret[i] = r.toOAuth2TokenSummary();
                });
                success(ret);
            } else {
                success(ret.toOAuth2TokenSummary());
            }
        } else {
            failure($.error.INVALID_GRANT);
        }
    };
    /**
     * 检测授权码回调函数
     */
    var checkCode = function(ret) {
        if(ret && ret.clientId == clientId && ret.redirectURI == redirectURI) {
            //打开生成token任务
            async.push(me.otService.gen, [clientId, ret.userid, use_refresh_token], me.otService, genToken);
        } else {
            failure($.error.INVALID_GRANT);
        }
    };
    /**
     * 检测刷新令牌码回调函数
     */
    var checkToken = function(ret) {
        if(ret && ret.clientId == clientId && ret.type == 2) {
            //打开生成token任务
            async.push(me.otService.gen, [clientId, ret.userid, false], me.otService, genToken);
        } else {
            failure($.error.INVALID_GRANT);
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
            async.push(me.otService.gen, [clientId, session.userid, use_refresh_token], me.otService, genToken);
        } else {
            failure($.error.INVALID_GRANT);
        }
    };
    /**
     * 检测登录客户端回调函数
     */
    var checkClient = function(ret) {
        if(ret) {
            if(request_type == $.service.OAuth2Service.REQUEST_TYPE_TOKEN && code) {
                //打开检测授权码任务
                async.push(me.ocService.checkCode, [code], me.ocService, checkCode);
            } else if(request_type == $.service.OAuth2Service.REQUEST_TYPE_PASSWORD && username && password) {
                //打开检测登录用户任务
                async.push(me.uService.checkUser, [username, password], me.uService, checkUser);
            } else if(request_type == $.service.OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN && refresh_token) {
                //打开检测刷新令牌码任务
                async.push(me.otService.checkToken, [refresh_token], me.otService, checkToken);
            } else {
                failure($.error.INVALID_GRANT);
            }
        } else {
            failure($.error.INVALID_CLIENT);
        }
    };
    /**
     * 检测请求参数
     */
    var checked = this.oService.checkRequest(scope, request_type);
    
    if(checked) {
        if(clientType !== false) {
            query = {clientId:clientId, clientSecret:clientSecret, redirectURI:redirectURI, clientType:clientType};
        } else {
            query = {clientId:clientId, clientSecret:clientSecret, redirectURI:redirectURI};
        }
        
        //打开检测登录客户端任务
        async.push(me.cService.checkClient, [query], me.cService, checkClient);
        async.exec();
    } else {
        failure($.error.INVALID_REQUEST);
    }
};
