
function Action(name, req, res, tpl) {
    
    var me = this;
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
    this.logger = {};
    /**
     * @api protected
     */
    this.response = {};
    /**
     * @api protected
     */
    this.user = null;
    /**
     * @api protected
     */
    this.hasPermission = false;
    /**
     * @api protected
     */
    this.scope = new $.util.Scope(req);
    
    me.on('before', me.before)
    .on('dispatch', me.dispatch)
    .on('before_render', me.beforeRender)
    .on('render', me.render)
    .on('after_render', me.afterRender)
    .on('finish', me.finish);
    this.classname = 'core.Action';
}

$.Util.inherits(Action, $.core.Event);

module.exports = exports = Action;

// lifecycle
Action.prototype.run = function run(callback) {
    var async = require('async');
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
        //$.Log.error(err);
        //$.Log.debug(rs);
        if(err) {
            me.res.json({isok:false, data:err});
        } else {
            //me.res.json({isok:false, code:$.error.NO_OUTPUT.code, data:$.error.NO_OUTPUT.message});
        }
        $.Log.info('----------------------- Finished -----------------------');
        //记日志
        $.Log.info(JSON.stringify(me.logger));
        callback && callback();
    });
    /*$.Log.info('-----------------------  Before  -----------------------');
    me.emit('before', function() {
        $.Log.info('----------------------- Dispatch -----------------------');
        me.emit('dispatch', function() {
            $.Log.info('----------------------- B_Render -----------------------');
            me.emit('before_render', function() {
                $.Log.info('-----------------------  Render  -----------------------');
                me.emit('render', function() {
                    $.Log.info('----------------------- A_Render -----------------------');
                    me.emit('after_render', function() {
                        $.Log.info('-----------------------  Finish  -----------------------');
                        me.emit('finish', function() {
                            $.Log.info('----------------------- Finished -----------------------');
                            me.res.json({isok:false, code:$.error.NO_OUTPUT.code, data:$.error.NO_OUTPUT.message});
                        });
                    });
                });
            });
        });
    });*/
};
Action.prototype.before = function before(fn, rs) {
    this.logger.name = this.name;
    this.logger.class = this.classname;
    this.logger.method = this.req.method;
    this.logger.get = this.req._get;
    this.logger.post = this.req._post;

    if(this.isUser() && this.isLogin()) {
        this.noPermission();
    } else {
        
    }
    setTimeout(function() {
        fn && fn();
    }, 0);
    //(function(fn) {fn && fn();})([].shift.call(arguments));
};
Action.prototype.dispatch = function dispatch(fn, rs) {
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
    if(!$.Util.isEmpty(this.response) && this.tpl) {
        $.Util.forEach(this.response, function($k, $v) {
            me.tpl.assign($k, $v);
        });
    }
    if(!$.Util.isEmpty(this.template) && this.tpl) {
        me.tpl.template(this.template);
        me.tpl.resource($.get('res.zh-cn'));
    }
    setTimeout(function() {
        fn && fn();
    }, 0);
    //(function(fn) {fn && fn();})([].shift.call(arguments));
};
Action.prototype.render = function render(fn, rs) {
    if(this.has_redirect) {
        this.res.redirect(200, this.redirect_uri);
    } else if(this.had_redirect) {
        //已经重定向了，不需要再输出内容
    } else if(this.template && this.tpl) {
        this.tpl.display(this.template);
    } else if(!$.Util.isEmpty(this.response)){
        this.res.json(this.response);
    } else {
        this.cleanResponse();
        this.response['isok'] = false;
        this.response['code'] = $.error.NO_OUTPUT.code;
        this.response['data'] = $.error.NO_OUTPUT.message;
        this.appendUser();//
        this.appendName();
        this.res.json(this.response);
    }
    setTimeout(function() {
        fn && fn();
    }, 0);
    //(function(fn) {fn && fn();})([].shift.call(arguments));
};
Action.prototype.afterRender = function afterRender(fn, rs) {
    setTimeout(function() {
        fn && fn();
    }, 0);
    //(function(fn) {fn && fn();})([].shift.call(arguments));
};
Action.prototype.finish = function finish(fn, rs) {
    setTimeout(function() {
        fn && fn();
    }, 0);
    //(function(fn) {fn && fn();})([].shift.call(arguments));
};
/*Action.prototype.onDestroy = function onDestroy() {
    
};*/

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
        this.response['name'] = this.name;
    }
};
Action.prototype.assign = function assign(key, value) {
    var me = this;
    if($.Util.isObject(key)) {
        Object.keys(key).map(function(pro, index) {
            me.response[pro] = key[pro];
        });
    } else {
        me.response[key] = value;
    }
};
Action.prototype.correctResponse = function correctResponse(data) {
    this.assign('isok', true);
    if(data) {
        this.assign('data', data);
    }
};
Action.prototype.incorrectResponse = function correctResponse(code, msg) {
    this.assign('isok', false);
    if($.Util.isObject(code)) {
        this.assign('data', false);
    } else {
        this.assign('code', code);
        this.assign('data', msg);
    }
};


//权限设置 
//是否需要用户存在
Action.prototype.isUser = function isUser() {
    return false;
};
Action.prototype.isAdmin = function isAdmin() {
    return false;
};
Action.prototype.isLogin = function isLogin() {
    return true;
};
Action.prototype.noPermission = function noPermission() {
    this.res.redirect(200, '/');
};
Action.prototype.noAdminPermission = function noAdminPermission() {
    this.noPermission();
};
Action.prototype.redirect = function redirect(url, lazy) {
    lazy = $.Util.isUndefined(lazy) || !$.Util.isBoolean(lazy) ? true : lazy;
    
    if(lazy) {
        this.has_redirect = true;
        this.redirect_uri = url;
    } else {
        this.had_redirect = true;
        this.res.redirect(200, url);
    }
};
