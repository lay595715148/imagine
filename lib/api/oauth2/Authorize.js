
function Authorize() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.core.Htmler.apply(this, arguments);
}

$.Util.inherits(Authorize, $.core.Htmler);

module.exports = exports = Authorize;

Authorize.classname = 'api.oauth2.Authorize';
Authorize.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.cService = $.factory('service.ClientService');
    this.uService = $.factory('service.UserService');
    this.oService = $.factory('service.OAuth2Service');
    this.ocService = $.factory('service.OAuth2CodeService');
    this.otService = $.factory('service.OAuth2TokenService');
    this._super_('before', fn, rs);
};

Authorize.prototype.onGet = function onGet(fn, rs) {
    var me = this;
    var scope = this.scope;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session(), suser = scope.user();
    //var suser = this.req.user;//session memecache user
    var response_type = request.response_type || 'code';
    var checked = this.oService.checkRequest(scope);
    var clientId = get.client_id;
    var redirectURI = get.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    if(checked) {
        var async = new $.util.Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        async.push(this.cService.checkClient, args, this.cService, function(ret) {
            if(ret) {
                me.user = suser;
                //me.assign('isok', true);
                //me.template.push({user:suser});
                me.template = 'login.jade';
                me.correctResponse({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
            } else {
                me.incorrectResponse($.error.INVALID_CLIENT);
                //me.template.push(Collector.response(false, me.name, 'invalid_client'));
                //me.template.json();
            }
            me._super_('onGet', fn, rs);
        });
        async.exec();
    } else {
        me.incorrectResponse($.error.INVALID_REQUEST);
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
    var args;
    var async = new $.util.Async();
    /**
     * 失败响应
     */
    var failure = function(msg, code) {
        me.incorrectResponse(msg, code);
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
            failure($.error.INVALID_GRANT);
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
            failure($.error.INVALID_TOKEN);
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
                async.push(me.otService.gen, [clientId, suser.id, use_refresh_token], me.otService, genToken);
            } else {
                //打开生成code任务
                async.push(me.ocService.gen, [clientId, suser.id, redirectURI], me.ocService, genCode);
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
                async.push(me.otService.gen, [clientId, suser.id, use_refresh_token], me.otService, genToken);
            } else {
                //打开生成code任务
                async.push(me.ocService.gen, [clientId, suser.id, redirectURI], me.ocService, genCode);
            }
        } else if(ret) {
            //打开检测 登录用户任务
            async.push(me.uService.checkUser, [post.username, post.password], me.uService, checkUser);
        } else {
            failure($.error.INVALID_CLIENT);
        }
    };
    /**
     * 检测请求参数
     */
    var checked = me.oService.checkRequest(scope, request_type);
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
        args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        //打开检测登录客户端任务
        async.push(me.cService.checkClient, args, me.cService, checkClient);
        async.exec();
    } else {
        failure($.error.INVALID_REQUEST);
    }
};
/**
 * @protected
 */
Authorize.prototype.update = function update(fn) {
    //var res = this.res;
    var req = this.req;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $.get('sign.cookie.session') || 'sid';
    if($.Util.isUndefined(cookie[sessid])) {
        //var key = cookie[sessid] = $.Util.MD5($.node_uuid.v4());
        /*var info;
        if(req.user) {
            info = [sessid, req.user.id, $.Util.time()];
        } else {
            info = [sessid, 0, $.Util.time()];
        }
        var key = cookie[sessid] = $.util.Base64.encode($.util.Encryption.encrypt(JSON.stringify(info)));
        res.cookie(sessid, key);
        scope.resolve(true);*/
        if(req.user) {
            this.setLogined(req.user.id);
        } else {
            this.setLogined();
        }
    }
    if(req.user) {
        cookie = scope.cookie();//获取更新后的cookie
        this.uService.inrt(cookie[sessid], req.user, function(ret) {
            $.Util.isFunction(fn) && fn(ret);
        });
    }
};
/**
 * @protected
 */
Authorize.prototype.remove = function remove(fn) {
    var req = this.req;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $.get('sign.cookie.session') || 'sid';

    if($.Util.isDefined(cookie[sessid])) {
        this.uService.mremove(cookie[sessid], function(ret) {
            req.user = null;
            scope.resolve(true);
            $.Util.isFunction(fn) && fn(ret);
        });
    } else {
        $.Util.isFunction(fn) && fn(ret);
    }
};

Authorize.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
