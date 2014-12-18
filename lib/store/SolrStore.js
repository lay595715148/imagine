
function SolrStore(model) {
    $.core.Solr.apply(this, [model, $.get('servers.solr.master')]);
}

$.Util.inherits(SolrStore, $.core.Solr);

module.exports = exports = SolrStore;

SolrStore.classname = 'store.SolrStore';
