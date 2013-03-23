Ext.define('ToDoList.store.UserStore', {
    extend: 'Ext.data.Store',
    requires: [
        'ToDoList.model.UserModel'
    ],
    config: {
        model: 'ToDoList.model.UserModel',
        autoSync: true,
        storeId: 'UserStore'
    }
});