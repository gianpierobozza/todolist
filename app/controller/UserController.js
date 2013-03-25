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
            returnToListButton: 'button[action=returnToList]',
            saveUserInfoButton: 'button[action=saveUserInfo]',
            userProfileButton: 'button[action=userProfileTap]',
            loginView: '#toDoLogin',
            userProfile: '#userProfile'
        },
        control: {
            logInButton: {
                tap: 'logInTap'
            },
            logOutButton: {
                tap: 'logOutTap'
            },
            returnToListButton: {
                tap: 'returnToList'
            },
            saveUserInfoButton: {
                tap: 'saveUserInfo'
            },
            userProfileButton: {
                tap: 'userProfileTap'
            },
            logInView: {
                signInCommand: 'onSignInCommand'
            }
        }
    },
    clearForm: function() {
        var userProfile = this.getUserProfile(),
            delayedTask = Ext.create('Ext.util.DelayedTask', function () {
            userProfile.destroy();
        });
        delayedTask.delay(750);
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
        var delayedTask = Ext.create('Ext.util.DelayedTask', function () {
            label.setHtml('');
            ToDoList.app.getController('UserController').onSignInCommand(toDoLogin, username, password);
            usernameField.setValue('');
            passwordField.setValue('');
        });
        delayedTask.delay(750);
    },
    logOutTap: function () {
        var controller = this;
        Ext.Ajax.request({
            url: '/logout',
            method: 'post',
            params: {
            },
            success: function (response) {
                var logoutResponse = Ext.JSON.decode(response.responseText);
                if (logoutResponse.success === true) {
                    ToDoList.util.LoggedUser.setUsername('');
                    ToDoList.util.LoggedUser.setUserId('');
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
            url: '/login',
            method: 'post',
            params: {
                user: username,
                pwd: password
            },
            success: function (response) {
                var loginResponse = Ext.JSON.decode(response.responseText);
                if (loginResponse.success === true) {
                    ToDoList.util.LoggedUser.setUsername(username);
                    ToDoList.util.LoggedUser.setUserId(loginResponse.user_id);
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
    returnToList: function (button, e, eOpts) {
        var controller = this,
            taskController = this.getApplication().getController('TaskController');
        Ext.Msg.confirm('Back to Home', 'Do you wish to continue? Unsaved changes will be lost forever..', function(button){
            if (button == 'yes') {
                controller.clearForm();
                Ext.Viewport.animateActiveItem(taskController.getTaskList(), controller.getSlideDownTransition());
            } else {
                return false;
            }
        });
    },
    saveUserInfo: function (button, e, eOpts) {
        var controller = this,
            taskController = this.getApplication().getController('TaskController'),
            form = this.getUserProfile(),
            formValues = form.getValues(),
            formFieldSet = Ext.getCmp('userFieldSet'),
            isValid = true,
            emptyMessage = '<br/><span class="requiredField">This fields are required</span>';
        form.setMasked({
            xtype: 'loadmask',
            message: 'Saving...',
            indicator:true
        });
        form.getFieldsAsArray().forEach(function(field) {
            field.setLabelCls('');
            formFieldSet.setInstructions(formFieldSet.getInstructions().replace(emptyMessage, ''));
        });
        form.getFieldsAsArray().forEach(function(field) {
            if (!field.isHidden() && !field.isDisabled()) {
                if (field.isXType('textfield') && field.getValue() == '') {
                    isValid = false;
                    field.setLabelCls('requiredField');
                }
            }
        });
        if (!isValid) {
            formFieldSet.setInstructions(formFieldSet.getInstructions()+emptyMessage);
            return false;
        }
        var user = Ext.create('ToDoList.model.UserModel', formValues);
        user.save({
            success: function() {
                controller.clearForm();
                form.setMasked(false);
                Ext.Viewport.animateActiveItem(taskController.getTaskList(), controller.getSlideDownTransition());
            },
            failure: function() {
                form.setMasked(false);
                Ext.Msg.alert('Error', 'There was an error saving your details.. Sorry!', Ext.emptyFn);
                controller.clearForm();
                Ext.Viewport.animateActiveItem(taskController.getTaskList(), controller.getSlideDownTransition());
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
        taskController.getTaskList().getStore().getProxy().setExtraParams({
            u_id: ToDoList.util.LoggedUser.getUserId()
        });
        taskController.getTaskList().getStore().load();
    },
    userProfileTap: function () {
        var controller = this;
        if (this.getUserProfile() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.UserProfile')]);
        }
        Ext.ModelManager.getModel('ToDoList.model.UserModel').load(ToDoList.util.LoggedUser.getUsername(),{
            success: function(user) {
                Ext.Viewport.animateActiveItem(controller.getUserProfile().setRecord(user), controller.getSlideUpTransition());
            }
        });
    }
});
