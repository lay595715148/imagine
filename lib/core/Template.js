
function Template(req, res, engine) {
    var path = require('path');
    /**
     * @api private
     */
    this._engine = engine;
    this._request = req;
    this._response = res;
    this._path = path.resolve(__dirname, '../../tpl');
    this._vars = {};
    this._error = false;
    this._headers = {};
    this._metas = {};
    this._jses = [];
    this._javascript = [];
    this._csses = [];
    this._file = '';
    this._template = '';
    this._resources = {};
    this.classname = 'core.Template';
}

module.exports = exports = Template;

/**
 * @abstract
 */
Template.prototype.init = function init(engine) {
    /**
     * @api private
     */
    this._engine = engine;
};
Template.prototype.header = function header(headers, val) {
    var me = this;
    if($.Util.isString(headers)) {
        if($.Util.isUndefined(val)) {
            var pieces = headers.split(';');
            pieces.forEach(function(piece) {
                var pos = piece.indexOf(':');
                var pro = piece.substr(0, pos).trim();
                var val = piece.substr(pos + 1, piece.length - pos).trim();
                me.header(pro, val);
            });
        } else {
            this._headers[headers] = val;
        }
    } else if($.Util.isArray(headers)) {
        headers.forEach(function(header) {
            me.header(header);
        });
    } else if($.Util.isPureObject(headers)) {
        for( var pro in headers) {
            me.header(pro, headers[pro]);
        }
    }
};
Template.prototype.path = function path(p) {
    if($.Util.isString(p)) {
        this._path = p;
    }
};
Template.prototype.resource = function resource(name, val) {
    var me = this;
    if($.Util.isString(name)) {
        this._resources[name] = val;
    } else if($.Util.isArray(name)) {
        name.forEach(function(n) {
            me.resource(n);
        });
    } else if($.Util.isObject(name)) {
        for( var pro in name) {
            me.resource(pro, name[pro]);
        }
    }
};
Template.prototype.title = function title(str, l) {
    var vars = this._vars;
    if($.Util.isUndefined(vars.title)) {
        vars.title = str;
    } else {
        if(l === true) {
            vars.title = vars.title + str;
        } else {
            vars.title += str;
        }
    }
};
Template.prototype.push = function push(name, val) {
    var me = this;
    var vars = this._vars;
    if($.Util.isString(name)) {
        vars[name] = val;
    } else if($.Util.isArray(name)) {
        name.forEach(function(n) {
            me.push(n);
        });
    } else if($.Util.isPureObject(name)) {
        for( var pro in name) {
            me.push(pro, name[pro]);
        }
    }
};
Template.prototype.assign = function assign(name, val) {
    this.push(name, val);
};

// for root path or absolute path
Template.prototype.file = function file(f) {
    if($.Util.isString(f)) {
        this._file = f;
    }
};
Template.prototype.template = function template(tpl) {
    var path = require('path');
    if($.Util.isString(tpl) && $.Util.isDefined(this._path)) {
        if(tpl.indexOf(this._path) != -1) {
            this._template = tpl;
        } else {
            this._template = path.resolve(this._path, tpl);
        }
    }
};
Template.prototype.meta = function meta(meta, val) {
    var me = this;
    if($.Util.isString(meta)) {
        this._metas[meta] = val;
    } else if($.Util.isArray(meta)) {
        meta.forEach(function(m) {
            me.meta(m);
        });
    } else if($.Util.isPureObject(meta)) {
        for( var pro in meta) {
            me.meta(pro, meta[pro]);
        }
    }
};
Template.prototype.js = function js(js) {
    var me = this;
    if($.Util.isString(js)) {
        this._jses.push(js);
    } else if($.Util.isArray(js)) {
        js.forEach(function(j) {
            me.js(j);
        });
    }
};
Template.prototype.javascript = function javascript(js) {
    var me = this;
    if($.Util.isString(js)) {
        this._javascript.push(js);
    } else if($.Util.isArray(js)) {
        js.forEach(function(j) {
            me.javascript(j);
        });
    }
};
Template.prototype.css = function css(css) {
    var me = this;
    if($.Util.isString(css)) {
        this._css.push(css);
    } else if($.Util.isArray(css)) {
        css.forEach(function(c) {
            me.css(c);
        });
    }
};
Template.prototype.vars = function vars() {
    return this._vars;
};
Template.prototype.attachment = function attachment(f) {
    var fs = require('fs');
    if($.Util.isString(f)) {
        this.file(f);
    }

    var res = this._response;
    var file = this._file;

    if(fs.existsSync(file)) {
        res.attachment(file);
    }
};
Template.prototype.redirect = function redirect(url) {
    var res = this._response;
    res.redirect(302, url);
};

Template.prototype.error = function error() {
    var res = this._response;
    var err = {
        isok : false,
        data : this._response
    };
    res.json(err);
};
Template.prototype.json = function json() {
    var res = this._response;
    res.json(this._vars);
};
Template.prototype.jsonp = function jsonp() {
    var res = this._response;
    res.jsonp(this._vars);
};
Template.prototype.xml = function xml() {
    var res = this._response;
    var vars = this._vars;
    var headers = this._headers;
    var content = $.Util.toXml({
        root : vars
    });

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

    res.end(content);
};
/**
 * @abstract
 */
Template.prototype.out = function out(tpl) {
};
/**
 * @abstract
 */
Template.prototype.display = function display(tpl) {
};
