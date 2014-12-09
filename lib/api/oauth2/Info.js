
function Info() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.core.Htmler.apply(this, arguments);
}

$.Util.inherits(Info, $.core.Htmler);

module.exports = exports = Info;

Info.classname = 'api.oauth2.Info';
Info.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.cService = $.factory('service.ClientService');
    this.uService = $.factory('service.UserService');
    this.oService = $.factory('service.OAuth2Service');
    this.ocService = $.factory('service.OAuth2CodeService');
    this.otService = $.factory('service.OAuth2TokenService');
    this._super_('before', fn, rs);
};

Info.prototype.onGet = function onGet(fn, rs) {
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
                me.correctResponse({login_type:'authorize', title:'Info',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
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
Info.prototype.onPost = function onPost(fn, rs) {
    this._super_('onPost', fn, rs);
};
