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
            saveButton: {
                tap: 'saveTask'
            },
            taskList: {
                disclose: 'onDisclose'
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
    slideRight: function() {
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide',
            direction: 'right'
        });
        this.getTaskForm().reset();
        Ext.Viewport.setActiveItem(this.getTaskList());
    }
});
