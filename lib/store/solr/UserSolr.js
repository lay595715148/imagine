/* jshint eqeqeq: false */
/* global $ */
"use strict";

function UserSolr() {
    $.store.SolrStore.apply(this, [$.model.solr.User]);
}

$.Util.inherits(UserSolr, $.store.SolrStore);

module.exports = exports = UserSolr;

(function() {
	UserSolr.classname = 'store.solr.UserSolr';
})();
