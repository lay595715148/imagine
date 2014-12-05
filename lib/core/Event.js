
function Event() {
}

$.Util.inherits(Event, require('events').EventEmitter);

module.exports = exports = Event;

Event.classname = 'core.Event';
