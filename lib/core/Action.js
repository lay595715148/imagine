/* jshint eqeqeq: false */
/* global $ */
"use strict";

function Action(name, req, res, tpl) {
    /**
     * @api protected
     */
    this.name = name;
    /**
     * @api protected
     */
    this.req = req;
    /**
     * @api protected
     */
    this.res = res;
    /**
     * @api protected
     */
    this.tpl = tpl;
    /**
     * @api protected
     */
    this.template = '';
    /**
     * @api protected
     */
    this.logger = null;
    /**
     * @api protected
     */
    this.response = null;
    /**
     * @api protected
     */
    this.user = null;
    /**
     * @api protected
     */
    this.hasPermission = true;
    /**
     * @api protected
     */
    this.scope = new $.util.Scope(req);

    this.init();
}

$.Util.inherits(Action, $.core.Event);

module.exports = exports = Action;

(function() {
    Action.classname = 'core.Action';
    Action.prototype.init = function init(callback) {
        var me = this;
        this.logger = {};
        this.response = {};
    
        this.logger.name = this.name;
        this.logger.class = $.Util.getClassname(this);
        this.logger.method = this.req.method;
        this.logger.get = this.req._get;
        this.logger.post = this.req._post;

        me.on('before', me.before)
            .on('dispatch', me.dispatch)
            .on('before_render', me.beforeRender)
            .on('render', me.render)
            .on('after_render', me.afterRender)
            .on('finish', me.finish);
    };
    // lifecycle
    Action.prototype.run = function run(callback) {
        var async = $.async;
        var me = this;
        async.auto({
            before : function(fn, rs) {
                $.Log.info('-----------------------  Before  -----------------------');
                me.emit('before', fn, rs);
            },
            dispatch : ['before', function(fn, rs) {
                $.Log.info('----------------------- Dispatch -----------------------');
                me.emit('dispatch', fn, rs);
            }],
            before_render : ['before', 'dispatch', function(fn, rs) {
                $.Log.info('----------------------- B_Render -----------------------');
                me.emit('before_render', fn, rs);
            }],
            render : ['before', 'dispatch', 'before_render', function(fn, rs) {
                $.Log.info('-----------------------  Render  -----------------------');
                me.emit('render', fn, rs);
            }],
            after_render : ['before', 'dispatch', 'before_render', 'render', function(fn, rs) {
                $.Log.info('----------------------- A_Render -----------------------');
                me.emit('after_render', fn, rs);
            }],
            finish : ['before', 'dispatch', 'before_render', 'render', 'after_render', function(fn, rs) {
                $.Log.info('-----------------------  Finish  -----------------------');
                me.emit('finish', fn, rs);
            }]
        }, function(err, rs) {
            //错误与结果
            if(err) {
                me.incorrectResponse(err);
                me.res.json(me.response);
            } else if(!me._has_render){
                me.incorrectResponse($.error.NO_OUTPUT);
                me.res.json(me.response);
            }
            //结束
            $.Log.info('----------------------- Finished -----------------------');
            //记日志
            $.Log.info(JSON.stringify(me.logger));
            callback && callback();
        });
    };
    Action.prototype.before = function before(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    Action.prototype.dispatch = function dispatch(fn, rs) {
        if(this.hasPermission) {
            $.Log.info('----------------------- Get Post -----------------------');
            if(this.req.method === 'POST') {
                this.onPost.apply(this, arguments);
            } else if(this.req.method === 'PUT') {
                this.onPut.apply(this, arguments);
            } else if(this.req.method === 'DELETE') {
                this.onDelete.apply(this, arguments);
            } else {
                this.onGet.apply(this, arguments);
            }
        } else {
            setTimeout(function() {
                fn && fn();
            }, 0);
        }
    };
    /**
     * @abstract
     */
    Action.prototype.onGet = function onGet(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
        //(function(fn) {fn && fn();})([].shift.call(arguments));
    };
    /**
     * @abstract
     */
    Action.prototype.onPut = function onPut(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    /**
     * @abstract
     */
    Action.prototype.onDelete = function onDelete(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    /**
     * @abstract
     */
    Action.prototype.onPost = function onPost(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    Action.prototype.beforeRender = function beforeRender(fn, rs) {
        var me = this;
        
        this.appendUser();
        this.appendName();
        
        //将response中的变量赋值到模板引擎中
        if(!$.Util.isEmpty(this.response) && this.tpl && !$.Util.isEmpty(this.template)) {
            $.Util.forEach(this.response, function($k, $v) {
                me.tpl.assign($k, $v);
            });
            me.tpl.template(this.template);
            me.tpl.resource($.get('res.zh-cn'));
        }
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    Action.prototype.render = function render(fn, rs) {
        this._has_render = true;
        if(this._has_redirect) {
            this.res.redirect(this._auto_redirect ? 302 : 200, this._redirect_uri);
        } else if(this._had_redirect) {
            //已经重定向了，不需要再输出内容
        } else if(this.template && this.tpl) {
            this.tpl.display(this.template);
        } else if(!$.Util.isEmpty(this.response)){
            this.res.json(this.response);
        } else {
            this.cleanResponse();
            this.appendUser();//
            this.appendName();
            this.incorrectResponse($.error.NO_OUTPUT);
            this.res.json(this.response);
        }
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    Action.prototype.afterRender = function afterRender(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };
    Action.prototype.finish = function finish(fn, rs) {
        setTimeout(function() {
            fn && fn();
        }, 0);
    };

    //functions
    Action.prototype.cleanResponse = function cleanResponse() {
        this.response = {};
    };
    Action.prototype.cleanTemplate = function cleanTemplate() {
        this.template = '';
    };
    Action.prototype.appendUser = function appendUser() {
        if(this.hasPermission && this.user && this.response['isok'] && this.response['isok'] === true) {
            this.response['user'] = this.user;
        }
    };
    Action.prototype.appendName = function appendName() {
        if(this.name) {
            //this.response['name'] = this.name;
        }
    };
    Action.prototype.assign = function assign(key, value) {
        var me = this;
        if($.Util.isObject(key)) {
            Object.keys(key).map(function(pro, index) {
                me.assign(pro, key[pro]);
            });
        } else if($.Util.isString(key)) {
            me.response[key] = value;
        } else {
            //什么也不做
        }
    };
    /**
     * 普通响应，总是懒响应
     * @param data
     */
    Action.prototype.correctResponse = function correctResponse(data) {
        this.assign('isok', true);
        if($.Util.isArray(data)) {
            this.correctResponseList(data, data.length);
        } else if(!$.Util.isUndefined(data)) {
            this.assign('data', data);
        }
    };
    /**
     * 规范化列表对象结果响应，也是懒响应
     * @param list
     * @param total
     * @param hasNext
     * @param sinceId
     */
    Action.prototype.correctResponseList = function correctResponseList(list, total, hasNext, sinceId) {
        this.assign('isok', true);
        if($.Util.isA(list, $.data.List)) {
            this.assign('data', list);
        } else {
            list = new $.data.List(list, total, hasNext, sinceId);
            this.assign('data', list);
        }
    };
    /**
     * 错误响应，总是懒响应
     * @param msg
     * @param code
     */
    Action.prototype.incorrectResponse = function correctResponse(msg, code) {
        this.assign('isok', false);
        if($.Util.isException(msg)) {
            this.assign('data', msg.message);
            this.assign('code', msg.code);
        } else if($.Util.isDefined(msg) || $.Util.isDefined(code)) {
            this.assign('data', msg);
            this.assign('code', code);
        }
    };
    /**
     * 重定向响应，可选直接响应
     * @param url
     * @param lazy
     */
    Action.prototype.redirect = function redirect(url, lazy, auto) {
        lazy = $.Util.isUndefined(lazy) || !$.Util.isBoolean(lazy) ? true : lazy;
        auto = $.Util.isUndefined(auto) || !$.Util.isBoolean(auto) ? false : auto;
        if(lazy) {
            this._has_redirect = true;
            this._redirect_uri = url;
            this._auto_redirect = auto;
        } else {
            this._had_redirect = true;
            this.res.redirect(auto ? 302 : 200, url);
        }
    };
})();
