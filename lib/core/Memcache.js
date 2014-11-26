
function Memcache(model, config) {
    $.core.Store.apply(this, arguments);
    this.classname = 'core.Memcache';
}

$.Util.inherits(Memcache, $.core.Store);

module.exports = exports = Memcache;

/**
 * @abstract
 */
Memcache.prototype.init = function init() {
    
};
