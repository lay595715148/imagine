
function Redirect() {
    this.cService = null;
    this.uService = null;
    this.oService = null;
    this.ocService = null;
    this.otService = null;
    $.core.Jsonor.apply(this, arguments);
}

$util.inherits(Redirect, $.core.Jsonor);

module.exports = exports = Redirect;

Redirect.classname = 'api.Redirect';
Redirect.prototype.before = function before(fn, rs) {
    //初妈化一些service
    this.cService = $.factory('service.ClientService');
    this.uService = $.factory('service.UserService');
    this.oService = $.factory('service.OAuth2Service');
    this.ocService = $.factory('service.OAuth2CodeService');
    this.otService = $.factory('service.OAuth2TokenService');
    this._super_('before', fn, rs);
};
Redirect.prototype.onGet = function(fn, rs) {
    var scope = this.scope;
    var request = scope.request();
    
    this._super_('onGet', fn, rs);
};
