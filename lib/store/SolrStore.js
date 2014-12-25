/* jshint eqeqeq: false */
/* global $ */
"use strict";

function SolrStore(model) {
    $.core.Solr.apply(this, [model, $.get('servers.solr.master')]);
}

$.Util.inherits(SolrStore, $.core.Solr);

module.exports = exports = SolrStore;

(function() {
	SolrStore.classname = 'store.SolrStore';
})();
