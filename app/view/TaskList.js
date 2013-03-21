var listItemTpl = new Ext.XTemplate(
    '<div class="task completed_{c}">\n\
        {t}\n\
        <tpl if="st"!=\'\' && "et"!=\'\'> from {st} to {et}</tpl>\n\
    </div>\n\
    <div class="deleteplaceholder"></div>'
);
Ext.define('ToDoList.view.TaskList', {
    extend: 'Ext.dataview.List',
    xtype: 'tasklist',
    requires: [
        'Ext.TitleBar',
        'ToDoList.store.TaskStore',
        'Ext.plugin.PullRefresh'
    ],
    config: {
        displayField: 'title',
        id: 'taskList',
        store: 'TaskStore',
        itemTpl: listItemTpl,
        selectedCls: '',
        onItemDisclosure: true,
        emptyText: '<p align="center" class="instructions">Nothing to do here yet.<br/>Tap the "Add" button to create one.</p>',
        grouped: true,
        plugins: [
            {
                xclass: 'Ext.plugin.PullRefresh',
                pullRefreshText: 'Pull down to refresh',
                refreshFn: function() {
                    Ext.getStore('TaskStore').load();
                }
            }
        ],
        items: [
            {
                xtype: 'toolbar',
                title: 'Your To-Do-List',
                docked: 'top',
                ui: 'light',
                items: [
                    {
                        xtype: 'button',
                        name: 'refreshButton',
                        cls: 'normalButtonOverride',
                        text: 'Refresh',
                        minWidth: '100px',
                        badgeText: '',
                        action: 'refreshList'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        iconMask: true,
                        text: 'Add',
                        action: 'createTask'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                title: '',
                ui: 'dark',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        ui: 'decline',
                        iconMask: true,
                        text: 'Logout',
                        action: 'logOutButtonTap'
                    }
                ]
            }
        ]
    }
});