Ext.define('ToDoList.controller.UserController', {
    extend: 'Ext.app.Controller',
    requires: [
        'ToDoList.model.UserModel',
        'ToDoList.store.UserStore',
        'Ext.Anim'
    ],
    config: {
        id: 'userController',
        refs: {
            logInButton: 'button[action=logInTap]',
            logOutButton: 'button[action=logOutTap]',
            userProfileButton: 'button[action=userProfileTap]',
            loginView: '#toDoLogin',
            userProfileView: '#userProfile'
        },
        control: {
            logInButton: {
                tap: 'logInTap'
            },
            logOutButton: {
                tap: 'logOutTap'
            },
            logInView: {
                signInCommand: 'onSignInCommand'
            },
            userProfileButton: {
                tap: 'userProfileTap'
            }
        }
    },
    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },
    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
    },
    getSlideUpTransition: function () {
        return { type: 'slide', direction: 'up' };
    },
    getSlideDownTransition: function () {
        return { type: 'slide', direction: 'down' };
    },
    logInTap: function () {
        var toDoLogin = Ext.getCmp('toDoLogin');
        var usernameField = toDoLogin.down('#userNameTextField'),
            passwordField = toDoLogin.down('#passwordTextField'),
            label = toDoLogin.down('#signInFailedLabel');
        label.hide();
        var username = usernameField.getValue(),
            password = passwordField.getValue();
        var task = Ext.create('Ext.util.DelayedTask', function () {
            label.setHtml('');
            ToDoList.app.getController('UserController').onSignInCommand(toDoLogin, username, password);
            usernameField.setValue('');
            passwordField.setValue('');
        });
        task.delay(500);
    },
    logOutTap: function () {
        var controller = this;
        Ext.Ajax.request({
            //url: '/logout',
            url: 'http://localhost:4242/logout',
            method: 'post',
            params: {
            },
            success: function (response) {
                var logoutResponse = Ext.JSON.decode(response.responseText);
                if (logoutResponse.success === true) {
                    ToDoList.util.LoggedUser.setUsername('');
                }
            }
        });
        Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());
    },
    onSignInCommand: function (view, username, password) {
        var controller = this,
            loginView = controller.getLoginView();
        if (username.length === 0 || password.length === 0) {
            loginView.showSignInFailedMessage('Please enter your username and password.');
            return;
        }
        loginView.setMasked({
            xtype: 'loadmask',
            message: 'Signing In...',
            indicator:true
        });
        Ext.Ajax.request({
            //url: '/login',
            url: 'http://localhost:4242/login',
            method: 'post',
            params: {
                user: username,
                pwd: password
            },
            success: function (response) {
                var loginResponse = Ext.JSON.decode(response.responseText);
                if (loginResponse.success === true) {
                    ToDoList.util.LoggedUser.setUsername(username);
                    controller.signInSuccess();
                } else {
                    controller.signInFailure(loginResponse.message);
                }
            },
            failure: function (response) {
                controller.signInFailure('Login failed. Please try again later.');
            }
        });
    },
    signInFailure: function (message) {
        var loginView = this.getLoginView();
        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);
    },
    signInSuccess: function () {
        var loginView = this.getLoginView(),
            taskController = this.getApplication().getController('TaskController');
        loginView.setMasked(false);
        if (taskController.getTaskList() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskList')]);
        }
        if (taskController.getTaskForm() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskForm')]);
        }
        Ext.Viewport.animateActiveItem(taskController.getTaskList(), this.getSlideLeftTransition());
        taskController.getTaskList().getStore().load();
    },
    userProfileTap: function () {
        if (this.getUserProfileView() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.UserProfile')]);
        }
        var userStore = Ext.create('ToDoList.store.UserStore', {
            model: 'ToDoList.model.UserModel'
        });
        console.log(userStore.load(ToDoList.util.LoggedUser.getUsername()));
        Ext.Viewport.animateActiveItem(this.getUserProfileView(), this.getSlideUpTransition());
        /*var loginView = this.getLoginView(),
            taskController = this.getApplication().getController('TaskController');
        loginView.setMasked(false);
        if (taskController.getTaskList() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskList')]);
        }
        if (taskController.getTaskForm() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskForm')]);
        }
        Ext.Viewport.animateActiveItem(taskController.getTaskList(), this.getSlideLeftTransition());
        taskController.getTaskList().getStore().load();*/
    }
});
