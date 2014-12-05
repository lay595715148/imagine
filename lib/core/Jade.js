
function Jade(req, res) {
    $.core.Template.call(this, req, res, $.jade);
}

$.Util.inherits(Jade, $.core.Template);

module.exports = exports = Jade;

Jade.classname = 'core.Jade';
/**
 * 
 */
Jade.prototype.out = function out(tpl) {
    var fs = require('fs');
    var vars = this._vars;
    var resources = this._resources;
    var engine = this._engine;
    var content = '';

    if(tpl) {
        this.template(tpl);
    }
    try {
        content = engine.render(fs.readFileSync(this._template), $.Util.extend(vars, {res : resources}));
    } catch(e) {
        $.Log.error(e);
    }

    return content;
};
/**
 * 
 */
Jade.prototype.display = function display(tpl) {
    var fs = require('fs');
    var vars = this._vars;
    var res = this._response;
    var resources = this._resources;
    var engine = this._engine;
    var headers = this._headers;
    var content = '';

    if(tpl) {
        this.template(tpl);
    }
    try {
        content = engine.render(fs.readFileSync(this._template), $.Util.extend(vars, {res : resources}));
    } catch(e) {
        $.Log.error(e);
    }

    if($.Util.isEmpty(headers)) {
        for( var pro in headers) {
            var upper = pro.toUpperCase();
            var val = headers[pro];
            if((upper === 'STATUS' || upper === 'STATUSCODE') && ($.Util.isString(val) || $.Util.isNumber(val))) {
                if($.Util.isString(val)) {
                    val = parseInt(val);
                }
                res.statusCode = val;
            } else {
                res.setHeader(pro, val);
            }
        }
    }

    res.send(content);
};
