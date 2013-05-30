/**
 * Copyright or © or Copr. Ministère Français chargé de la Culture
 * et de la Communication (2013)
 * <p/>
 * contact.gincoculture_at_gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to provide a thesaurus
 * management solution.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software. You can use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading, using, modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systemsand/or
 * data to be ensured and, more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */

/*
 * Term Language Store 
 * This file contains all Term languages displayed in dropdown lists
 */
Ext.define('GincoApp.store.SearchResultStore', {
    extend: 'Ext.data.Store',
    
    listeners: {
        beforeload: function(store, operation,eOpts) {
        	if (store.proxy.jsonData==null) {
               store.proxy.jsonData = {"start":operation.start,
                                      "limit":operation.limit,
                                       };                        
            } else {
            	store.proxy.jsonData["start"] = operation.start;
            	store.proxy.jsonData["limit"] = operation.limit;
            	if (operation.sorters.length>0) {
            		store.proxy.jsonData["sortfield"] = operation.sorters[0].property;
            		store.proxy.jsonData["sortdir"] = operation.sorters[0].direction;
            	}
            }
        }
  },

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'JsonSearchResultStore',
            remoteSort: true,
            proxy: {
                type: 'ajax',
                url: 'services/ui/indexerservice/search',
                reader: {
                    type: 'json',
                    idProperty: 'identifier',
                    root: 'data'
                },
                doRequest: function(operation, callback, scope) {
                    var writer  = this.getWriter(),
                        request = this.buildRequest(operation);
                        
                    if (operation.allowWrite()) {
                        request = writer.write(request);
                    }
                    
                    Ext.apply(request, {
                        binary        : this.binary,
                        headers       : this.headers,
                        timeout       : this.timeout,
                        scope         : this,
                        callback      : this.createRequestCallback(request, operation, callback, scope),
                        method        : this.getMethod(request),
                        jsonData        : this.jsonData,
                        disableCaching: false // explicitly set it to false, ServerProxy handles caching
                    });
                    
                    Ext.Ajax.request(request);
                    
                    return request;
                },
                actionMethods: {
                    read   : 'POST'
                }
            },
            fields: [
                {
                    name: 'identifier',
                    type: 'string'
                },
                {
                    name: 'lexicalValue',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                },
                {
                    name: 'thesaurusId',
                    type: 'string'
                },
                {
                    name: 'thesaurusTitle',
                    type: 'string'
                },
                {
                    name: 'created',
                    type: 'string'
                },
                {
                    name: 'modified',
                    type: 'string'
                }
                
            ]
        }, cfg)]);
    }
});