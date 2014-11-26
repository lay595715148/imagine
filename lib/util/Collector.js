var ResponseData = $.data.ResponseData;
var ResponseErrorData = $.data.ResponseErrorData;
var RequestData = $.data.RequestData;
var ListData = $.data.ListData;

function Collector() {
    this.classname = 'util.Collector';
}

module.exports = exports = Collector;

/**
 * 以JSON格式响应输出
 * 
 * @param success
 *            {Boolean}
 * @param action
 *            {String|Object}
 * @param content
 *            {Object|String|Number|Boolean}
 * @returns {Object}
 */
Collector.response = function(success, action, content, code) {
    var rsp;
    if(success) {
        rsp = new ResponseData();
        rsp.setSuccess(success);
        rsp.setAction(action);
        if($util.isArray(content)) {
            rsp.setContent(Collector.list(content, content.length, false));
        } else {
            rsp.setContent(content);
        }
    } else {
        rsp = new ResponseErrorData();
        rsp.setSuccess(success);
        rsp.setAction(action);
        rsp.setMessage(content);
        rsp.setCode(code);
    }
    return $util.json(rsp);
};
/**
 * 
 * @param data
 *            {Object}
 * @returns {RequestData}
 */
Collector.request = function(data) {
    var req = new RequestData();
    rsp.setSession(data.session);
    rsp.setAction(data.action);
    rsp.setContent(data.content);
    return req;
};
/**
 * 用于response响应时以JSON格式输出
 * 
 * @param list
 *            {Array}
 * @param total
 *            {Number}
 * @param hasNext
 *            {Boolean}
 * @returns {Object}
 */
Collector.list = function(list, total, hasNext) {
    return $util.json(new ListData(list, total, hasNext));
};
