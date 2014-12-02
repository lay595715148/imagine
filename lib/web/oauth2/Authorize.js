
function Authorize() {
    $.core.Htmler.apply(this, arguments);
    this.classname = 'web.oauth2.Authorize';
    //初妈化一些service
    this.oservice = $.factory('service.OAuth2Service');
    this.cservice = $.factory('service.ClientService');
    this.uservice = $.factory('service.UserService');
    this.codeservice = $.factory('service.OAuth2CodeService');
    this.tservice = $.factory('service.OAuth2TokenService');
}

$.Util.inherits(Authorize, $.core.Htmler);

module.exports = exports = Authorize;

Authorize.prototype.onGet = function onGet(fn, rs) {
    var me = this;
    var scope = this.scope;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session(), suser = scope.user();
    //var suser = this.req.user;//session memecache user
    var response_type = request.response_type || 'code';
    var checked = this.oservice.checkRequest(scope);
    var clientId = get.client_id;
    var redirectURI = get.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    if(checked) {
        var async = new $.util.Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        async.push(this.cservice.checkClient, args, this.cservice, function(ret) {
            if(ret) {
                me.user = suser;
                //me.assign('isok', true);
                //me.template.push({user:suser});
                me.assign({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
                me.template = 'login.jade';
                me.correctResponse();
            } else {
                me.incorrectResponse($.error.INVALID_CLIENT.code, $.error.INVALID_CLIENT.message);
                //me.template.push(Collector.response(false, me.name, 'invalid_client'));
                //me.template.json();
            }
            me._super_('onGet', fn, rs);
        });
        async.exec();
    } else {
        me.incorrectResponse($.error.INVALID_REQUEST.code, $.error.INVALID_REQUEST.message);
        //me.assign(Collector.response(false, me.name, 'invalid_request'));
        //me.template.json();
        me._super_('onGet', fn, rs);
    }
};
Authorize.prototype.onPost = function onPost(fn, rs) {
    var me = this;
    var sessid = $.get('sign.cookie.session') || 'sid';
    var scope = this.scope;
    var use_refresh_token = $.get('oauth2.use_refresh_token') ? true : false;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session(), suser = scope.user();
    var response_type = request.response_type || 'code';
    var request_type = 'post';
    var clientId = request.client_id;
    var redirectURI = request.redirect_uri;
    var clientType = response_type == 'token' ? 3 : 1;
    var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
    var async = new $.util.Async();
    /**
     * 失败响应
     */
    var failure = function(code, msg) {
        me.incorrectResponse(code, msg);
        //me.template.push(Collector.response(false, me.name, msg));
        //me.template.json();
        me._super_('onPost', fn, rs);
    };
    /**
     * 用户名密码错误
     */
    var relogin = function() {
        me.assign({error:'用户名密码错误'});
        me.assign({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
        //me.template.template('login.jade');
        //me.template.display();
        me.template = 'login.jade';
        me._super_('onPost', fn, rs);
    };
    /**
     * 成功重定向响应
     */
    var success = function(url) {
        me.redirect(url);
        me._super_('onPost', fn, rs);
    };
    /**
     * 生成code回调函数
     */
    var genCode = function(code) {
        if(code) {
            success(redirectURI + '?code=' + encodeURIComponent(code.code));
        } else {
            //invalid_grant
            failure($.error.INVALID_GRANT.code, $.error.INVALID_GRANT.message);
        }
    };
    /**
     * 生成token回调函数
     */
    var genToken = function(result) {
        if(result) {
            //返回OAuth2Token对象或OAuth2Token对象数组
            if(use_refresh_token) {
                var token = result[0];
                var rtoken = result[1];
                success(redirectURI + '#userid=' + suser.id + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires + '&refresh_token=' + encodeURIComponent(rtoken.token) + '&refresh_expires=' + rtoken.expires);
            } else {
                var token = result;
                success(redirectURI + '#userid=' + suser.id + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires);
            }
        } else {
            //INVALID_TOKEN
            failure($.error.INVALID_TOKEN.code, $.error.INVALID_TOKEN.message);
        }
    };
    /**
     * 检测登录的用户回调函数
     */
    var checkUser = function(ret) {
        if(ret) {
            suser = me.req.user = ret;
            //suser.id = ret.id;
            //suser.name = ret.name;
            if(response_type == 'token') {
                //打开生成token任务
                async.push(me.tservice.gen, [clientId, suser.id, use_refresh_token], me.tservice, genToken);
            } else {
                //打开生成code任务
                async.push(me.codeservice.gen, [clientId, suser.id, redirectURI], me.codeservice, genCode);
            }
            //更新seesion memcache user
            me.update();
        } else {
            relogin();
        }
    };
    /**
     * 检测登录客户端回调函数
     */
    var checkClient = function(ret) {
        if(ret && suser && suser.id && suser.name) {
            if(response_type == 'token') {
                //打开生成token任务
                async.push(me.tservice.gen, [clientId, suser.id, use_refresh_token], me.tservice, genToken);
            } else {
                //打开生成code任务
                async.push(me.codeservice.gen, [clientId, suser.id, redirectURI], me.codeservice, genCode);
            }
        } else if(ret) {
            //打开检测 登录用户任务
            async.push(me.uservice.checkUser, [post.username, post.password], me.uservice, checkUser);
        } else {
            failure('invalid_client');
        }
    };
    /**
     * 检测请求参数
     */
    var checked = me.oservice.checkRequest(scope, request_type);
    /**
     * 检测使用其他账号登录
     */
    var other = !$.Util.isEmpty(request.otherlogin);
    var register = !$.Util.isEmpty(request.register);

    if(other) {
        //清除seesion memcache user
        me.remove();
        //清除cookie
        me.res.clearCookie(sessid);
        //跳转至认证页
        success($.get('urls.oauth2.authorize') + '?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectURI) + '&response_type=' + response_type);
    } else if(register) {
        //跳转至注册页
        success($.get('urls.register'));
    } else if(checked) {
        //打开检测登录客户端任务
        async.push(me.cservice.checkClient, args, me.cservice, checkClient);
        async.exec();
    } else {
        failure($.error.INVALID_REQUEST.code, $.error.INVALID_REQUEST.message);
    }
};
/**
 * @protected
 */
Authorize.prototype.update = function update(fn) {
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        res.cookie(sessid, key);
        scope.resolve(true);
    }
    if(req.user) {
        uservice.mcreate(cookie[sessid], req.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
/**
 * @protected
 */
Authorize.prototype.remove = function remove(fn) {
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mremove(cookie[sessid], function(ret) {
            req.user = null;
            scope.resolve(true);
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(ret);
    }
};

Authorize.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
