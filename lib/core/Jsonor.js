
function Jsonor(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Template(req, res));
}

$.Util.inherits(Jsonor, $.core.Action);

module.exports = exports = Jsonor;

Jsonor.classname = 'core.Jsonor';
Jsonor.prototype.appendName = function appendName() {
    if(this.name) {
        this.response['name'] = this.name;
    }
};
