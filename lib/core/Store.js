
function Store(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
    
    this.init();
}

module.exports = exports = Store;

Store.classname = 'core.Store';
/**
 * @abstract
 */
Store.prototype.init = function init() {
    
};
