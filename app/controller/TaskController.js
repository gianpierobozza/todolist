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
            refreshButton: 'button[action=refreshList]',
            saveButton: 'button[action=saveTask]',
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
        var taskForm = this.getTaskForm(),
            task = Ext.create('Ext.util.DelayedTask', function () {
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
                var taskStore = Ext.getStore('TaskStore'),
                    record = taskStore.getById(ToDoList.app.getController('TaskController').getTaskForm().getValues()._id);
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
        var form = this.getTaskForm(),
            formValues = form.getValues(),
            formFieldSet = Ext.getCmp('mainFieldSet'),
            isValid = true,
            emptyMessage = '<br/><span class="requiredField">This fields are required</span>';
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
        var taskStore = Ext.getStore('TaskStore');
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
    }
});
