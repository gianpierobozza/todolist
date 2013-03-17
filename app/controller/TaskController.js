Ext.define('ToDoList.controller.TaskController', {
    extend: 'Ext.app.Controller',
    requires: [
        'ToDoList.model.TaskModel'
    ],
    config: {
        id: 'taskController',
        refs: {
            backToListButton: 'button[action=backToList]',
            createButton: 'button[action=createTask]',
            deleteButton: 'button[action=deleteTask]',
            logInButton: 'button[action=logInButtonTap]',
            logOffButton: 'button[action=logOffButtonTap]',
            saveButton: 'button[action=saveTask]',
            taskForm: '#taskForm',
            taskList: '#taskList',
            taskToolbar: '#taskToolbar',
            loginView: '#toDoLogin'
        },
        control: {
            backToListButton: {
                tap: 'backToList'
            },
            createButton: {
                tap: 'createTask'
            },
            deleteButton: {
                tap: 'deleteTask'
            },
            logInButton: {
                tap: 'logInButtonTap'
            },
            logOffButton: {
                tap: 'logOffButtonTap'
            },
            saveButton: {
                tap: 'saveTask'
            },
            taskList: {
                disclose: 'onDisclose'
            },
            logInView: {
                signInCommand: 'onSignInCommand'
            }
        }
    },

    launch: function () {
        //this.updateTaskCount();
    },
    backToList: function (button, e, eOpts) {
        Ext.Msg.confirm('Back to Home', 'Do you wish to continue? Unsaved changes will be lost forever..', function(button){
            if (button == 'yes') {
                ToDoList.app.getController('TaskController').slideRight();
            } else {
                return false;
            }
        });
    },
    createTask: function (button, e, eOpts) {
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide',
            direction: 'left'
        });
        this.getTaskToolbar().setTitle('Create Task');
        Ext.getCmp('taskFormDeleteFieldset').hide();
        Ext.Viewport.setActiveItem(this.getTaskForm());
    },
    deleteTask: function (button, e, eOpts) {
        Ext.Msg.confirm('Delete', 'Do you wish to continue? This can\'\t be undone..', function(button){
            if (button == 'yes') {
                var taskStore = Ext.getStore('TaskStore');
                var record = taskStore.getById(ToDoList.app.getController('TaskController').getTaskForm().getValues()._id);
                record.erase({
                    success: function() {
                        taskStore.load();
                    }
                });
                ToDoList.app.getController('TaskController').slideRight();
            } else {
                return false;
            }
        });
        
    },
    logInButtonTap: function () {
        var toDoLogin = Ext.getCmp('toDoLogin');
        var usernameField = toDoLogin.down('#userNameTextField'),
            passwordField = toDoLogin.down('#passwordTextField'),
            label = toDoLogin.down('#signInFailedLabel');
        label.hide();
        var username = usernameField.getValue(),
            password = passwordField.getValue();
        var task = Ext.create('Ext.util.DelayedTask', function () {
            label.setHtml('');
            ToDoList.app.getController('TaskController').onSignInCommand(toDoLogin, username, password);
            usernameField.setValue('');
            passwordField.setValue('');
        });
        task.delay(500);
    },
    logOffButtonTap: function () {
        var controller = this;
        Ext.Ajax.request({
            url: '/logoff',
            method: 'post',
            params: {
                sessionToken: controller.sessionToken
            },
            success: function (response) {
                var logoffResponse = Ext.JSON.decode(response.responseText);
                if (logoffResponse.success === true) {
                    controller.sessionToken = null;
                }
            }
        });
        Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());
    },
    saveTask: function (button, e, eOpts) {
        var formValues = this.getTaskForm().getValues();
        var taskStore = Ext.getStore('TaskStore').load();
        var maxId = -1;
        if (taskStore.getCount() > 0) {
            maxId = taskStore.getAt(0).get('_id'); // initialise to the first record's id value.
            taskStore.each(function(rec) {// go through all the records
                maxId = Math.max(maxId, rec.get('_id'));
            });
        }
        if (formValues._id == '') {
            // create
            formValues.u_id = 1; // DEFAULT USER!!!!!!
        }
        var todoElem = Ext.create('ToDoList.model.TaskModel', formValues);
        todoElem.save({
            success: function() {
                taskStore.load();
            }
        });        
        ToDoList.app.getController('TaskController').slideRight();
    },
    onDisclose: function(list, record, target, index) {
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide',
            direction: 'left'
        });
        this.getTaskToolbar().setTitle('View Task');
        Ext.getCmp('taskFormDeleteFieldset').show();
        Ext.Viewport.setActiveItem(this.getTaskForm().setRecord(record));
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
                    controller.sessionToken = loginResponse.sessionToken;
                    controller.signInSuccess();
                } else {
                    controller.signInFailure(loginResponse.message);
                }
            },
            failure: function (response) {
                controller.sessionToken = null;
                controller.signInFailure('Login failed. Please try again later.');
            }
        });
    },
    signInSuccess: function () {
        var loginView = this.getLoginView();
        taskList = this.getTaskList();
        loginView.setMasked(false);
        Ext.Viewport.animateActiveItem(taskList, this.getSlideLeftTransition());
    },
    signInFailure: function (message) {
        var loginView = this.getLoginView();
        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);
    },
    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },
    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
    },    
    slideRight: function() {
        taskForm = this.getTaskForm();
        var task = Ext.create('Ext.util.DelayedTask', function () {
            taskForm.reset();
            taskForm.getScrollable().getScroller().scrollTo(0,0);
        });
        task.delay(500);
        Ext.Viewport.animateActiveItem(this.getTaskList(), this.getSlideRightTransition());
    }
});
