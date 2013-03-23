Ext.define('ToDoList.util.LoggedUser', {
    singleton : true,
    username : '',
    getUsername : function() {
        return this.username;
    },
    setUsername : function(user) {
        this.username = user;
    }
});