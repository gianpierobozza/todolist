Ext.define('ToDoList.model.UserModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: '_id', type: 'auto' },
            { name: 'u_id', type: 'string' },
            { name: 'n', type: 'string' },
            { name: 's', type: 'string' },
            { name: 'u', type: 'string' },
            { name: 'p', type: 'string' },
            { name: 'e', type: 'string' }
        ],
        idProperty: '_id',
        proxy: {
            type: 'rest',
            url: '/api/users/',
            callbackKey: 'callback',
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        }
    }
});
