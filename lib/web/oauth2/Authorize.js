
function Authorize() {
    $.core.Htmler.apply(this, arguments);
    this.classname = 'web.oauth2.Authorize';
}

$.Util.inherits(Authorize, $.core.Htmler);

module.exports = exports = Authorize;

Authorize.prototype.onGet = function onGet(fn, rs) {
    var me = this;
    var oservice = $.factory('service.OAuth2Service');
    var cservice = $.factory('service.ClientService');
    var scope = this.scope;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session(), suser = scope.user();
    //var suser = this.req.user;//session memecache user
    var response_type = request.response_type || 'code';
    var checked = oservice.checkRequest(scope);
    var clientId = get.client_id;
    var redirectURI = get.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    if(checked) {
        var async = new $.util.Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        async.push(cservice.checkClient, args, cservice, function(ret) {
            if(ret) {
                me.user = suser;
                //me.assign('isok', true);
                //me.template.push({user:suser});
                me.assign({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
                me.template = 'login.jade';
                me.correctResponse();
            } else {
                me.incorrectResponse(101001, $.get('errors.' + 101001));
                //me.template.push(Collector.response(false, me.name, 'invalid_client'));
                //me.template.json();
            }
            me._super_('onGet', fn, rs);
        });
        async.exec();
    } else {
        me.incorrectResponse(101000, $.get('errors.' + 101000));
        //me.assign(Collector.response(false, me.name, 'invalid_request'));
        //me.template.json();
        me._super_('onGet', fn, rs);
    }
};
Authorize.prototype.onPost = function onPost(fn, rs) {
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Authorize.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
