
function Cli() {
    this.io = null;
    this.app = null;
    this.server = null;
    this.settings = {};
}

module.exports = exports = Cli;

Cli.prototype.init = function init() {
    var cfg = $.core.Config;
    var err = $.core.Exception;
    cfg.configure(__dirname + '/../../cfg/env.json');
    cfg.configure(__dirname + '/../../cfg/common');
    cfg.configure(__dirname + '/../../cfg/res');
    cfg.configure(__dirname + '/../../cfg/' + cfg.get('env'));
    err.configure($.get('errors'));
};
Cli.prototype.set = function set(k, v) {
    this.settings[k] = v;
};
Cli.prototype.open = function open() {
    var host = this.settings.host || '127.0.0.1';
    var port = this.settings.port || 8808;
    var api_host = this.settings.api_host || host;
    var api_port = this.settings.api_port || port;
    var api_url = this.settings.api_url || 'http://' + api_host + ':' + api_port + '/';
    
    
};
