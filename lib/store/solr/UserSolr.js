
function UserSolr() {
    $.store.SolrStore.apply(this, [$.model.solr.User]);
}

$.Util.inherits(UserSolr, $.store.SolrStore);

module.exports = exports = UserSolr;

UserSolr.classname = 'store.solr.UserSolr';
