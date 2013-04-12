/**
 * Copyright or © or Copr. Ministère Français chargé de la Culture et de la
 * Communication (2013) <p/> contact.ginco_at_culture.gouv.fr <p/> This software
 * is a computer program whose purpose is to provide a thesaurus management
 * solution. <p/> This software is governed by the CeCILL license under French
 * law and abiding by the rules of distribution of free software. You can use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info". <p/> As a counterpart to the access to the source
 * code and rights to copy, modify and redistribute granted by the license,
 * users are provided only with a limited warranty and the software's author,
 * the holder of the economic rights, and the successive licensors have only
 * limited liability. <p/> In this respect, the user's attention is drawn to the
 * risks associated with loading, using, modifying and/or developing or
 * reproducing the software by the user in light of its specific status of free
 * software, that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systemsand/or data
 * to be ensured and, more generally, to use and operate it in the same
 * conditions as regards security. <p/> The fact that you are presently reading
 * this means that you have had knowledge of the CeCILL license and that you
 * accept its terms.
 */

/**
 * @docauthor Hubert FONGARNAND
 *
 * This files contains extends or override to implement missing accessibility functions to ExtJS
 * WARNING this file is made for EXTJS-4.1-GPL only
 */

/*
 * Implement Aria for extjs combobox
 */

Ext.define('Thesaurus.form.field.ComboBox',
{
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.ariacombo',
	fieldSubTpl: [
	              '<div class="{hiddenDataCls}" role="presentation"></div>',
	              '<input id="{id}" type="{type}" role="combobox" {inputAttrTpl} class="{fieldCls} {typeCls} {editableCls}" autocomplete="off"',
	                  '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
	                  '<tpl if="name"> name="{name}"</tpl>',
	                  '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
	                  '<tpl if="size"> size="{size}"</tpl>',
	                  '<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
	                  '<tpl if="readOnly"> readonly="readonly" aria-readonly="true" aria-autocomplete="none"</tpl>',
	                  '<tpl if="disabled"> disabled="disabled"</tpl>',
	                  '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
	                  '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
	                  '/>',
	              {
	                  compiled: true,
	                  disableFormats: true
	              }
	          ],
	          createPicker: function() {
	              var me = this,
	                  picker,
	                  pickerCfg = Ext.apply({
	                      xtype: 'ariaboundlist',
	                      pickerField: me,
	                      selModel: {
	                          mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
	                      },
	                      floating: true,
	                      hidden: true,
	                      store: me.store,
	                      displayField: me.displayField,
	                      focusOnToFront: false,
	                      pageSize: me.pageSize,
	                      multiSelect: me.multiSelect,
	                      tpl: me.tpl
	                  }, me.listConfig, me.defaultListConfig);

	              picker = me.picker = Ext.widget(pickerCfg);
	              if (me.pageSize) {
	                  picker.pagingToolbar.on('beforechange', me.onPageChange, me);
	              }

	              me.mon(picker, {
	                  itemclick: me.onItemClick,
	                  refresh: me.onListRefresh,
	                  scope: me
	              });

	              me.mon(picker.getSelectionModel(), {
	                  beforeselect: me.onBeforeSelect,
	                  beforedeselect: me.onBeforeDeselect,
	                  selectionchange: me.onListSelectionChange,
	                  scope: me
	              });
	              Ext.get(me.id+"-inputEl").set({'aria-owns':picker.id+'-listUl'});
	              return picker;
	          },  
	          onExpand : function()
	          {
	        	  var me = this,
	               picker, collapseIf;
	        	  if (me.rendered &&  me.picker) {
	                  picker = me.getPicker();;
	                  Ext.get(picker.id+"-listUl").set({'aria-expanded':true});
	        	  }
	        	  me.callParent();
	          },
	          onCollapse : function()
	          {
	        	  var me = this,
	               picker, collapseIf;
	        	  if (me.rendered && me.picker) {
	                  picker = me.getPicker();
	                  Ext.get(picker.id+"-listUl").set({'aria-expanded':false});
	                  Ext.get(me.id+"-inputEl").set({'aria-activedescendant':null});
	        	  }
	        	  me.callParent();
	          },
	          focusItem : function (item)
	          {
	        	  var me = this;
	        	  console.log("focusing ",item.id );
	        	  Ext.get(me.id+"-inputEl").set({'aria-activedescendant':item.id});
	          }
	   
});

Ext.define('Thesaurus.view.BoundList', {
	extend : 'Ext.view.BoundList',
	alias: 'widget.ariaboundlist',
	multiSelect : false,
	initComponent: function() {
        var me = this,
            baseCls = me.baseCls,
            itemCls = me.itemCls,
            id = me.id;
       
        if (!me.tpl) {
            // should be setting aria-posinset based on entire set of data
            // not filtered set
            me.tpl = new Ext.XTemplate(
                '<ul id="'+id+'-listUl" role="listbox" aria-multiselectable="'+me.multiSelect+'"><tpl for=".">',
                    '<li id="'+id+'-listUl-{#}" role="option" tabindex="-1" class="' + itemCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
                '</tpl></ul>'
            );
        }
        me.callParent();
	},
	highlightItem: function ( item ){
		var me = this;
		me.callParent(arguments);
		me.pickerField.focusItem(item);
	},
    onItemSelect: function(record) {
    	var me = this;
    	var node = this.getNode(record);
        if (node) {
            Ext.fly(node).set({'aria-selected': true} );
        }
		me.callParent(arguments);
    },
    onItemDeselect: function(record) {
    	var me = this;
    	var node = this.getNode(record);
        if (node) {
            Ext.fly(node).set({'aria-selected': false} );
        }
		me.callParent(arguments);
    },
});

/*
 * Define a menu item with an accesskey
 */

Ext
		.define(
				'Thesaurus.ext.KeyMenuItem',
				{
					extend : 'Ext.menu.Item',
					alias : 'widget.keymenuitem',
					renderTpl : [
							'<tpl if="plain">',
							'{text}',
							'</tpl>',
							'<tpl if="!plain">',
							'<a id="{id}-itemEl" class="'
									+ Ext.baseCSSPrefix
									+ 'menu-item-link keymenuitem-link" href="{href}" <tpl if="hrefTarget">target="{hrefTarget}"</tpl> hidefocus="true" unselectable="on">',
							'<img id="{id}-iconEl" src="{icon}" class="'
									+ Ext.baseCSSPrefix
									+ 'menu-item-icon {iconCls}" />',
							'<span id="{id}-textEl" class="'
									+ Ext.baseCSSPrefix
									+ 'menu-item-text keymenuitem-text">{text}</span>',
							'<span class="'
									+ Ext.baseCSSPrefix
									+ 'menu-item-text keymenuitem-cmdTxt" <tpl if="menu">style="margin-right: 17px;"</tpl> >{cmdTxt}</span>',
							'<tpl if="menu">',
							'<img id="{id}-arrowEl" src="{blank}" class="'
									+ Ext.baseCSSPrefix + 'menu-item-arrow" />',
							'</tpl>', '</a>', '</tpl>' ],
					beforeRender : function(ct, pos) {
						// Intercept the call to onRender so we can add the
						// keyboard shortcut text to the render data which
						// will be used by the template
						var me = this;
						Ext.applyIf(me.renderData, {
							cmdTxt : me.cmdTxt
						});
						me.callParent(arguments);
					}
				});

/*
 * Manage focus on table
 */
Ext.view.View.addInheritableStatics({
	EventMap: {
        mousedown: 'MouseDown',
        mouseup: 'MouseUp',
        click: 'Click',
        dblclick: 'DblClick',
        contextmenu: 'ContextMenu',
        mouseover: 'MouseOver',
        mouseout: 'MouseOut',
        mouseenter: 'MouseEnter',
        mouseleave: 'MouseLeave',
        keydown: 'KeyDown',
        focus: 'Focus',
        blur: 'Blur'
    }
}
);

/*
 * Manage focus on table
 */
Ext.define('Thesaurus.ext.view.View', {
	override : 'Ext.view.View',
	focusCls: 'focus',
	onBeforeContainerFocus: Ext.emptyFn,
	onBeforeContainerBlur: Ext.emptyFn,
	onContainerFocus: function (e) {
		var me = this,
			focusCls = me.focusCls;
		me.getEl().addCls(me.addClsWithUI(focusCls, true));
		if (!me.hasFocus) {
            me.hasFocus = true;
            me.fireEvent('focus', me, e);
        }
	},
	onContainerBlur: function (e) {
		var me = this,
			focusCls = me.focusCls;
		me.getEl().removeCls(me.removeClsWithUI(focusCls, true));
		me.hasFocus = false;
        me.fireEvent('blur', me, e);
	},
	afterRender: function(){
        var me = this;
        me.callParent();
        me.mon(me.getTargetEl(), {
            scope: me,
            /*
             * We need to make copies of this since some of the events fired here will end up triggering
             * a new event to be called and the shared event object will be mutated. In future we should
             * investigate if there are any issues with creating a new event object for each event that
             * is fired.
             */
            freezeEvent: true,
            focus: me.handleEvent,
            blur: me.handleEvent
        });
    }
});


/*
 * Override treeView to add 'alt' attribute to img in the tree.
 */
Ext.define('Thesaurus.ext.tree.Column', {
	override : 'Ext.tree.Column',
	imgText : '<img src="{1}" class="{0}" alt="" />',
	constructor : function(config) {
		this.callSuper(arguments);
	}
});

/*
 * Override treePanel to add aria role
 */
Ext.define('Thesaurus.Ext.tree.View', {
	override : 'Ext.tree.View',
	ariaRole : 'treegrid',
	onRowSelect: function(rowIdx) {
    	var me = this;
        me.callParent();
        var row = this.getNode(rowIdx);
        if (row) {
            Ext.fly(row).focus();
            Ext.fly(row).set({'aria-selected':true});
        }
    },
    onRowDeselect : function(rowIdx) {
        var me = this;
        me.callParent();
        var row = this.getNode(rowIdx);
        if (row) {
            Ext.fly(row).set({'aria-selected':false});
        }
    },
});


/*
 * Override panel tool to add 'alt' attribute to img in the tree.
 */
Ext
.define(
		'Thesaurus.panel.Tool',
		{
			override : 'Ext.panel.Tool',
			renderTpl : [ '<img id="{id}-toolEl" src="{blank}" class="{baseCls}-{type}" alt="{type}" role="presentation"/>' ],
			constructor : function(config) {
				this.callSuper(arguments);
			}
		});

/*
 * Remove width attr from table on fields form
 */
Ext.define("Thesaurus.form.field.Base", {
	override : 'Ext.form.field.Base',
	getLabelCellAttrs: function() {
        var me = this,
            labelAlign = me.labelAlign,
            result = '';

        if (labelAlign !== 'top') {
            result = 'valign="top" halign="' + labelAlign+ '"';
        }
        return result + ' class="' + Ext.baseCSSPrefix + 'field-label-cell"';
    },
    getLabelCellStyle: function() {
        var me = this,
            hideLabelCell = me.hideLabel || (!me.fieldLabel && me.hideEmptyLabel);

        var style =  hideLabelCell ? 'display:none;' : '';
        style = style+ ' width:' + (me.labelWidth + me.labelPad) + 'px;';
        return style;
    },
    afterLabelTextTpl : new Ext.XTemplate(
			'<tpl if="allowBlank === false"><span class="mandatory-field"><abbr title="obligatoire">*</abbr></span></tpl>',
			{
				disableFormats : true
			})
});

/*
 * Make close button for a tab keyboard accessible
 */
Ext.define('Thesaurus.tab.Tab', {
	override : 'Ext.tab.Tab',
	onCloseBtnKey : function()
	{
		this.onCloseClick();
	},
	listeners: {
		render : {
			fn : function(){
				var me = this;
				if (me.closeEl){
					me.keyNav = new Ext.util.KeyNav(me.closeEl, {
			            enter: me.onCloseBtnKey,
			            scope: me
			        });
				}
				
			}
		}
	}
});

/*
 * Remove default role=presentation
 */
Ext.define("Thesaurus.layout.container.Box", {
	override : 'Ext.layout.container.Box',
	renderTpl: [
	            '{%var oc,l=values.$comp.layout,oh=l.overflowHandler;',
	            'if (oh.getPrefixConfig!==Ext.emptyFn) {',
	                'if(oc=oh.getPrefixConfig())dh.generateMarkup(oc, out)',
	            '}%}',
	            '<div id="{ownerId}-innerCt" class="{[l.innerCls]} {[oh.getOverflowCls()]}">',
	                '<div id="{ownerId}-targetEl" style="position:absolute;',
	                        // This width for the "CSS container box" of the box child items gives
	                        // them the room they need to avoid being "crushed" (aka, "wrapped").
	                        // On Opera, elements cannot be wider than 32767px or else they break
	                        // the scrollWidth (it becomes == offsetWidth) and you cannot scroll
	                        // the content.
	                        'width:20000px;',
	                        // On IE quirks and IE6/7 strict, a text-align:center style trickles
	                        // down to this el at times and will cause it to move off the left edge.
	                        // The easy fix is to just always set left:0px here. The top:0px part
	                        // is just being paranoid. The requirement for targetEl is that its
	                        // origin align with innerCt... this ensures that it does!
	                        'left:0px;top:0px;',
	                        // If we don't give the element a height, it does not always participate
	                        // in the scrollWidth.
	                        'height:1px">',
	                    '{%this.renderBody(out, values)%}',
	                '</div>',
	            '</div>',
	            '{%if (oh.getSuffixConfig!==Ext.emptyFn) {',
	                'if(oc=oh.getSuffixConfig())dh.generateMarkup(oc, out)',
	            '}%}',
	            {
	                disableFormats: true,
	                definitions: 'var dh=Ext.DomHelper;'
	            }
	        ]
});

/*
 * Add aria role attribute to components.
 * Add check roles to ext components
 */
Ext.define('Thesaurus.Acc.Component', {
	override : 'Ext.Component',
	initAria: function() {
        var actionEl = this.getActionEl(),
            role = this.ariaRole;
        if (role) {
            actionEl.dom.setAttribute('role', role);
        }
    },
	afterRender: function() {
		var me = this;
		me.callParent();
		me.initAria();
	}
});

/*
 * Implement aria-hidden property
 */
Ext.define("Thesaurus.dom.Element", {
	override : 'Ext.dom.Element',
	setVisible : function(visible, animate) {
		var me = this;
		me.callParent(arguments);
		me.set({
        	'aria-hidden' : !visible
        });
		return me;
	}
});

/*
 * Remove border attr from tables
 */
Ext.view.TableChunker.metaTableTpl = [
                                                  '{%if (this.openTableWrap)out.push(this.openTableWrap())%}',
                                                  '<table class="' + Ext.baseCSSPrefix + 'grid-table ' + Ext.baseCSSPrefix + 'grid-table-resizer" cellspacing="0" cellpadding="0" {[this.embedFullWidth(values)]}>',
                                                      '<tbody>',
                                                      '<tr class="' + Ext.baseCSSPrefix + 'grid-header-row">',
                                                      '<tpl for="columns">',
                                                          '<th class="' + Ext.baseCSSPrefix + 'grid-col-resizer-{id}" style="width: {width}px; height: 0px;"></th>',
                                                      '</tpl>',
                                                      '</tr>',
                                                      '{[this.openRows()]}',
                                                          '{row}',
                                                          '<tpl for="features">',
                                                              '{[this.embedFeature(values, parent, xindex, xcount)]}',
                                                          '</tpl>',
                                                      '{[this.closeRows()]}',
                                                      '</tbody>',
                                                  '</table>',
                                                  '{%if (this.closeTableWrap)out.push(this.closeTableWrap())%}'
                                              ];

/*
 * Add tabindex to role to allow focus() from javascript
 */
Ext.view.TableChunker.embedRowAttr= function() {
    return '{rowAttr} tabindex="-1" role="row"';
};