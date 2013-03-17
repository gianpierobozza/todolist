var titleTpl = new Ext.XTemplate(
    '<div class="task completed_{c}">\n\
        {t}\n\
    </div>'
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
        itemTpl: titleTpl,
        onItemDisclosure: true,
        emptyText: '<p align="center" class="instructions">No tasks here yet.<br/>Tap the "+" button to create one.</p>',
        grouped: true,
        plugins: [
            {
                xclass: 'Ext.plugin.PullRefresh',
                pullRefreshText: 'Pull down to refresh'
            }
        ],
        items: [
            {
                xtype: 'toolbar',
                title: 'ToDoList by @GianpieroBozza',
                docked: 'top',
                ui: 'light',
                items: [
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
                        action: '' //TODO
                    }
                ]
            }
        ]
    }
});