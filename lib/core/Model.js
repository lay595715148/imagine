
function Model() {
}

module.exports = exports = Model;

Model.classname = 'core.Model';
/**
 * @abstract
 */
Model.table = Model.prototype.table = function table() {};
/**
 * @abstract
 */
Model.columns = Model.prototype.columns = function columns() {};
/**
 * 主键字段名
 * @abstract
 */
Model.primary = Model.prototype.primary = function primary() {};
/**
 * 返回一个字段名与model名的映射对象
 * @abstract
 * @returns
 */
Model.relations = Model.prototype.relations = function relations() {};
/**
 * 在与数据库操作时会根据这个rules来进行检查
 * @abstract
 * @returns
 */
Model.rules = Model.prototype.rules = function rules() {};
/**
 * 自增涨字段，一般为主键字段名，mongodb数据库中有专表记录
 * @abstract
 */
Model.sequence = Model.prototype.sequence = function sequence() {};
/**
 * 主键属性名
 * @abstract
 */
Model.key = Model.prototype.key = function key() {};
