
function Home() {
    $.core.Jsonor.apply(this, arguments);
    this.classname = 'json.user.Home';
}

$.Util.inherits(Home, $.core.Jsonor);

module.exports = exports = Home;

Home.prototype.onGet = function onGet(fn, rs) {
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Home.prototype.onPost = function onPost(fn, rs) {
    setTimeout(function() {
        fn && fn();
    }, 0);
};
Home.prototype.noPermission = function noPermission() {
    //this.res.redirect(200, '/');
};
