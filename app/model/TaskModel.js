Ext.define('ToDoList.model.TaskModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: '_id', type: 'auto' },
            { name: 'u_id', type: 'string' },
            { name: 't', type: 'string' },
            { name: 'd', type: 'string' },
            { name: 'dd', type: 'date' },
            { name: 'st', type: 'string' },
            { name: 'et', type: 'string' },
            { name: 'ad', type: 'boolean' },
            { name: 'c', type: 'boolean' }
        ],
        idProperty: '_id',
        proxy: {
            type: 'rest',
            url: 'http://192.168.1.111:4242/api/todos/',
            //url: 'http://localhost:4242/api/todos/',
            extraParams: {
                u_id: 1 // DEFAULT User
            },
            callbackKey: 'callback',
            reader: {
                type: 'json',
                rootProperty: 'todos'
            }
        }
    }
});
