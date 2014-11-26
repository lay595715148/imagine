
function Store(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
    
    this.init();
    this.classname = 'core.Store';
}

module.exports = exports = Store;

/**
 * @abstract
 */
Store.prototype.init = function init() {
    
};
