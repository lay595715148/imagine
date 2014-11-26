
function UserService() {
    $.core.Service.apply(this, arguments);
    this.classname = 'service.UserService';
}

$.Util.inherits(UserService, $.core.Service);

module.exports = exports = UserService;
