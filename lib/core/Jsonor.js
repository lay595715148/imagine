
function Jsonor(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Template(req, res));
    this.classname = 'core.Jsonor';
}

$.Util.inherits(Jsonor, $.core.Action);

module.exports = exports = Jsonor;
