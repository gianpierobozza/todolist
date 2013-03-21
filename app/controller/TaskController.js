Ext.define('ToDoList.controller.TaskController', {
    extend: 'Ext.app.Controller',
    requires: [
        'ToDoList.model.TaskModel',
        'Ext.Anim'
    ],
    config: {
        id: 'taskController',
        refs: {
            backToListButton: 'button[action=backToList]',
            createButton: 'button[action=createTask]',
            deleteButton: 'button[action=deleteTask]',
            logInButton: 'button[action=logInButtonTap]',
            logOutButton: 'button[action=logOutButtonTap]',
            refreshButton: 'button[action=refreshList]',
            saveButton: 'button[action=saveTask]',
            loginView: '#toDoLogin',
            taskForm: '#taskForm',
            taskList: '#taskList',
            taskToolbar: '#taskToolbar'
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
            logInView: {
                signInCommand: 'onSignInCommand'
            },
            logOutButton: {
                tap: 'logOutButtonTap'
            },
            refreshButton: {
                tap: 'refreshList'
            },
            saveButton: {
                tap: 'saveTask'
            },
            taskList: {
                disclose: 'onTaskDisclose',
                itemtap: 'onTaskTap',
                itemswipe: 'onTaskSwipe'
            }
        }
    },
    launch: function () {
    },
    backToList: function (button, e, eOpts) {
        var controller = this;
        Ext.Msg.confirm('Back to Home', 'Do you wish to continue? Unsaved changes will be lost forever..', function(button){
            if (button == 'yes') {
                controller.clearForm();
                Ext.Viewport.animateActiveItem(controller.getTaskList(), controller.getSlideRightTransition());
            } else {
                return false;
            }
        });
    },
    clearForm: function() {
        var taskForm = this.getTaskForm();
        var task = Ext.create('Ext.util.DelayedTask', function () {
            taskForm.destroy();
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskForm')]);
        });
        task.delay(500);
    },
    createTask: function (button, e, eOpts) {
        this.getTaskToolbar().setTitle('Create Task');
        Ext.getCmp('taskFormDeleteFieldset').hide();
        Ext.Viewport.animateActiveItem(this.getTaskForm(), this.getSlideLeftTransition());
    },
    deleteTask: function (button, e, eOpts) {
        var controller = this;
        Ext.Msg.confirm('Delete', "Do you wish to continue? This can't be undone..", function(button){
            if (button == 'yes') {
                var taskStore = Ext.getStore('TaskStore');
                var record = taskStore.getById(ToDoList.app.getController('TaskController').getTaskForm().getValues()._id);
                record.erase({
                    success: function() {
                        taskStore.load();
                    }
                });
                controller.clearForm();
                Ext.Viewport.animateActiveItem(controller.getTaskList(), controller.getSlideRightTransition());
            } else {
                return false;
            }
        });
        
    },
    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },
    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
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
    logOutButtonTap: function () {
        var controller = this;
        Ext.Ajax.request({
            url: '/logout',
            //url: 'http://localhost:4242/logout',
            method: 'post',
            params: {
                sessionToken: controller.sessionToken
            },
            success: function (response) {
                var logoutResponse = Ext.JSON.decode(response.responseText);
                if (logoutResponse.success === true) {
                    controller.sessionToken = null;
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
            //url: 'http://localhost:4242/login',
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
    onTaskDisclose: function(list, record, target, index) {
        this.getTaskToolbar().setTitle('View Task');
        Ext.getCmp('taskFormDeleteFieldset').show();
        Ext.Viewport.animateActiveItem(this.getTaskForm().setRecord(record), this.getSlideLeftTransition());
    },
    onTaskSwipe: function (list, index, target, record, e, eOpts ) {
        var taskList = this.getTaskList();
        if (e.direction === 'right') {
            this.onTaskDisclose(list, record, target, index);
        } else if (e.direction === 'left') {
            var del = Ext.create("Ext.Button", {
                ui: 'decline',
                text: 'Delete',
                cls: 'deleteListButton',
                handler: function(btn, e) {
                    e.stopEvent();
                    Ext.Msg.confirm('Delete', "Do you wish to continue? This can't be undone..", function(button){
                        if (button == 'yes') {
                            record.erase({
                                success: function() {
                                    Ext.getStore('TaskStore').load();
                                }
                            });
                        } else {
                            return false;
                        }
                    });
                }
            });
            var removeDeleteButton = function() {
                Ext.Anim.run(del, 'fade', {
                    after: function() {
                            del.destroy();
                    },
                    out: true
                });
            };
            del.renderTo(Ext.DomQuery.selectNode('.deleteplaceholder', target.element.dom));
            Ext.Anim.run(del, 'fade', {
                out : false
            });
            taskList.on({
                single: true,
                buffer: 250,
                itemtouchstart: removeDeleteButton
            });
            taskList.element.on({
                single: true,
                buffer: 250,
                touchstart: removeDeleteButton
            });
        }
    },
    onTaskTap: function(list, index, target, record) {
        this.onTaskDisclose(list, record, target, index);
    },
    refreshList: function (button, e, eOpts) {
        var taskList = this.getTaskList();
        taskList.setMasked({
            xtype: 'loadmask',
            message: 'Refreshing...',
            indicator:true
        });
        var taskStore = Ext.getStore('TaskStore').load();
    },
    saveTask: function (button, e, eOpts) {
        var form = this.getTaskForm();
        var formValues = form.getValues();
        var formFieldSet = Ext.getCmp('mainFieldSet');
        var isValid = true;
        var emptyMessage = '<br/><span class="requiredField">This fields are required</span>';
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
                if (field.isXType('datepickerfield') && field.getValue() == null) {
                    isValid = false;
                    field.setLabelCls('requiredField');
                }
            }
        });
        if (!isValid) {
            formFieldSet.setInstructions(formFieldSet.getInstructions()+emptyMessage);
            return false;
        }
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
        this.clearForm();
        Ext.Viewport.animateActiveItem(this.getTaskList(), this.getSlideRightTransition());
    },
    signInFailure: function (message) {
        var loginView = this.getLoginView();
        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);
    },
    signInSuccess: function () {
        var loginView = this.getLoginView();
        loginView.setMasked(false);
        if (this.getTaskList() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskList')]);
        }
        if (this.getTaskForm() == undefined) {
            Ext.Viewport.add([Ext.create('ToDoList.view.TaskForm')]);
        }
        Ext.Viewport.animateActiveItem(this.getTaskList(), this.getSlideLeftTransition());
        this.getTaskList().getStore().load();
    }
});
