Ext.define('ToDoList.store.TaskStore', {
    extend: 'Ext.data.Store',
    requires: [
        'ToDoList.model.TaskModel'
    ],
    config: {
        model: 'ToDoList.model.TaskModel',
        autoSync: true,
        autoLoad: true,
        storeId: 'TaskStore',
        sorters: ['dd', 'st', 't'], // date, start time, title
        grouper: function(record) {
            if (record && record.get("dd")) {
                return record.get("dd").toDateString();
            }
        }
    }
});
