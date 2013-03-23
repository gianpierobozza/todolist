Ext.define('ToDoList.store.TaskStore', {
    extend: 'Ext.data.Store',
    requires: [
        'ToDoList.model.TaskModel'
    ],
    config: {
        model: 'ToDoList.model.TaskModel',
        autoSync: true,
        storeId: 'TaskStore',
        grouper: {
            sortProperty: 'dd',
            groupFn: function(record) {
                return record.get("dd").toDateString();
            }
        },
        listeners: {
            load : function(){
                var taskStore = Ext.getStore('TaskStore');
                taskStore.getProxy().setExtraParams({
                    u_id: ToDoList.util.LoggedUser.getUserId()
                });
                taskStore.filter([
                    { 
                        filterFn: function(item) {
                            return item.get('c') === false;
                        }
                    }
                ]);
                var refreshButton = Ext.ComponentQuery.query('button[name="refreshButton"]').pop();
                refreshButton.setBadgeText(taskStore.getData().items.length);
                taskStore.clearFilter();
            }
        }
    }
});
