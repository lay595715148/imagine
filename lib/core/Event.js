
function Event() {
    this.classname = 'core.Event';
}

$.Util.inherits(Event, require('events').EventEmitter);

module.exports = exports = Event;
