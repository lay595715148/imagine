
function Htmler(cmd, req, res) {
    $.core.Action.call(this, cmd, req, res, new $.core.Jade(req, res));
}

$.Util.inherits(Htmler, $.core.Action);

module.exports = exports = Htmler;

Htmler.classname = 'core.Htmler';
