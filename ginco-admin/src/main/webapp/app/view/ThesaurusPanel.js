/*
 * File: app/view/ThesaurusPanel.js
 * Thesaurus Creation Form
 * 
 */
Ext.define('HadocApp.view.ThesaurusPanel', {
    extend: 'Ext.panel.Panel',

    thesaurusId: '',

    alias: 'widget.thesaurusPanel',
    localized: true,
    autoScroll: true,
    closable: true,
    
    /*Fields with auto generated values*/
    xIdentifierLabel : 'Identifier',
    xCreatedDateLabel : 'Creation date',
    xDateLabel : 'Last Modification Date',

    /*Fields prompting values*/
    xTitleLabel : 'Title',
    xServiceLabel : 'Service',
    xUrlLabel : 'URL',
    xContributorLabel : 'Contributor',
    xPublisherLabel : 'Publisher',
    xPublisherValue : 'Ministère chargé de la culture',
    xRightsLabel : 'Rights',
    xDescriptionLabel : 'Description',
    xCoverageLabel : 'Coverage',
    xSubjectLabel : 'Subject',
    xTypeLabel : 'Type',
    xFormatLabel : 'Format',
    xLanguagesLabel : 'Languages',
    xRelationLabel : 'Relation',
    xSourceLabel : 'Source',
    xThesaurusTitle : 'Thesaurus',
   
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
        	title: me.xThesaurusTitle,
            items: [
                {
                    xtype: 'form',
                    title: me.xThesaurusTitle,
                    pollForChanges : true,
                    defaults: {
                        anchor: '70%',
                        afterLabelTextTpl: new Ext.XTemplate('<tpl if="allowBlank === false"><span style="color:red;">*</span></tpl>', { disableFormats: true })
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Enregistrer',
                                    disabled: true,
                                    formBind: true,
                                    cls: 'save',
                                    iconCls : 'icon-save'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Créer version',
                                    disabled: true
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                        	xtype: 'displayfield',
                        	name:'id',
                        	fieldLabel: me.xIdentifierLabel
                        },
                        {
                        	xtype: 'displayfield',
                        	name:'created',
                        	fieldLabel: me.xCreatedDateLabel
                        },
                        {
                            xtype: 'displayfield',
                            name:'date',
                            fieldLabel: me.xDateLabel
                        },
                        {
                            xtype: 'textfield',
                            name:'title',
                            fieldLabel: me.xTitleLabel,
                            allowBlank: false
                        },
                        {
                        	 xtype: 'container',
                        	 title : 'test container',
                        	 layout: 'column',
                        	 defaults: {
                                 margin:'0 50 5 0',
                                 layout: 'anchor'
                             },
                        	 items: [{
	                        	xtype: 'textfield',
	                        	name:'creatorName',
	                        	columnWidth: 0.50,
	                        	fieldLabel: me.xServiceLabel
	                        },
	                        {
	                        	xtype: 'textfield',
	                        	name:'creatorHomepage',
	                        	columnWidth: 0.50,
	                        	margin:'0 0 5 0',
	                        	fieldLabel: me.xUrlLabel,
	                        	labelWidth: 50,
	                        	vtype:'url'
	                        }]
                        },
                        {
                        	xtype: 'textareafield',
                        	name:'contributor',
                        	fieldLabel: me.xContributorLabel,
                        	grow: true
                        },
                        {
                        	xtype: 'textfield',
                        	name:'publisher',
                        	fieldLabel: me.xPublisherLabel,
                        	value: me.xPublisherValue
                        },
                        {
                        	xtype: 'textareafield',
                        	name:'rights',
                        	fieldLabel: me.xRightsLabel,
                        	allowBlank: false,
                        	grow: true
                        },
                        {
                            xtype: 'textareafield',
                            name: 'description',
                            fieldLabel: me.xDescriptionLabel,
                            grow: true
                        },
                        {
                        	xtype: 'textareafield',
                        	name:'coverage',
                        	fieldLabel: me.xCoverageLabel,
                        	grow: true
                        },
                        {
                        	xtype: 'textareafield',
                        	name:'subject',
                        	fieldLabel: me.xSubjectLabel,
                        	grow: true
                        },
                        {
                        	xtype : 'combobox',
                        	name : 'type',
                            queryMode : 'local',
                            fieldLabel : me.xTypeLabel,
                        	editable : false,
                        	displayField : 'label',
                        	valueField : 'identifier',
                        	forceSelection : true,
                        	multiSelect : false,
                        	store : 'ThesaurusTypeStore'
                        },
                        {
                        	xtype: 'combobox',
                        	name:'format',
                        	fieldLabel: me.xFormatLabel,
                        	editable : false,
                        	displayField : 'label',
                        	valueField : 'identifier',
                        	forceSelection : true,
                        	multiSelect : false,
                        	store : 'ThesaurusFormatStore'
                        },
                        {
                        	xtype: 'combobox',
                        	name:'languages',
                        	fieldLabel: me.xLanguagesLabel,
                        	editable : false,
                        	displayField : 'refname',
                        	valueField : 'id',
                        	forceSelection : true,
                        	multiSelect : true,
                        	store : 'ThesaurusLanguageStore'
                        },
                        {
                            xtype: 'htmleditor',
                            name: 'relation',
                            fieldLabel: me.xRelationLabel,
                            enableAlignments: false,
                            enableColors: false,
                            enableFont: false,
                            enableFontSize: false,
                            enableFormat: false,
                            enableLists: false,
                            enableSourceEdit: false
                        },
                        {
                            xtype: 'htmleditor',
                            name: 'source',
                            fieldLabel: me.xSourceLabel,
                            enableAlignments: false,
                            enableColors: false,
                            enableFont: false,
                            enableFontSize: false,
                            enableFormat: false,
                            enableLists: false,
                            enableSourceEdit: false
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});