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

Ext.define('GincoApp.controller.SearchPanelController', {
	extend : 'Ext.app.Controller',

	onSearchGridLoad : function (theGrid) 
	{
		var thePanel = theGrid.up('searchPanel');
		thePanel.setTitle(thePanel.title + ' : '
				+ thePanel.searchQuery);
	},
	
	onDisplayResultBtn : function(theButton) {
		var theGrid = theButton.up("gridpanel");
		this.onResultDblClick(theGrid);
		
	},
	
	onResultDblClick : function (theGrid) 
	{
		var topTabs = theGrid.up('thesaurusTabs');
		var items = theGrid.getSelectionModel().getSelection();
		if (items.length > 0) {
			var item = items[0];
			if (item.data.type=="ThesaurusConcept") {
				topTabs.fireEvent('openconcepttab',topTabs, item.data.thesaurusId,item.data.identifier);
			}
			if (item.data.type=="ThesaurusTerm") {
				topTabs.fireEvent('opentermtab',topTabs, item.data.thesaurusId,item.data.identifier);
			}
		}
	},
	
	onSearchPanelLoad: function (thePanel)
	{
		var model = Ext.create('GincoApp.model.FilterCriteriaModel');
		model.set('query',thePanel.up('searchPanel').searchQuery);
		thePanel.loadRecord(model);
		this.onFilterBtn(thePanel.down('#filterBtn'));
	}, 
	
	onFilterBtn : function (theBtn)
	{
		var theForm = theBtn.up('#advancedSearchForm');
		theForm.getForm().updateRecord();
		var theQueryModel = theForm.getForm().getRecord();
		var thePanel = theForm.up("searchPanel");
		var theGrid = thePanel.down('gridpanel');
		
		var theStore = theGrid.getStore();
		theStore.getProxy().setExtraParam('query',
				thePanel.searchQuery);
		theStore.getProxy().jsonData=theQueryModel.data;
		theStore.loadPage(1,{ scope :this,
			callback : 	function(records, operation, success) {
				    if (success==false) {
				    	Thesaurus.ext.utils.msg("Warning",
								operation.error);
				    } else 
				    {
				    	if (records.length>0) {
				    		theGrid.getSelectionModel().select(0);
				    	}
				    }
				}
		});
	},
	
	init : function(application) {
		this.control({
			'#advancedSearchForm' : {
				afterrender : this.onSearchPanelLoad
			},
			'#advancedSearchForm #filterBtn' : {
				click : this.onFilterBtn
			},
			'searchPanel gridpanel' : {
				afterrender : this.onSearchGridLoad,
				itemdblclick : this.onResultDblClick
			}, 
			'#displayResultBtn' :  {
				click : this.onDisplayResultBtn
			}
		});
	}

});
