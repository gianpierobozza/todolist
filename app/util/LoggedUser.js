Ext.define('ToDoList.util.LoggedUser', {
    singleton: true,
    username: '',
    user_id: '',
    getUsername : function() {
        return this.username;
    },
    setUsername : function(username) {
        this.username = username;
    },
    getUserId : function() {
        return this.user_id;
    },
    setUserId : function(user_id) {
        this.user_id = user_id;
    }
});