Ext.define('ToDoList.view.TaskForm', {
    extend: 'Ext.form.Panel',
    xtype: 'taskform',
    requires: [
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.DatePicker',
        'Ext.field.Hidden',
        'Ext.field.Toggle'
    ],
    config: {
        id: 'taskForm',
        items: [
            {
                xtype: 'toolbar',
                id: 'taskToolbar',
                title: {
                    title: 'New Task',
                    centered: true
                },
                docked: 'top',
                ui: 'light',
                items: [
                    {
                        xtype: 'button',
                        ui: 'back',
                        iconMask: true,
                        text: 'Back',
                        action: 'backToList'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        iconMask: true,
                        text: 'Save',
                        action: 'saveTask'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                id: 'mainFieldSet',
                instructions: 'Enter the details of the task',
                title: 'Task Details',
                items: [
                    {
                        xtype: 'hiddenfield',
                        id: 'taskId',
                        name: '_id'
                    },
                    {
                        xtype: 'hiddenfield',
                        id: 'userId',
                        name: 'u_id'
                    },
                    {
                        xtype: 'textfield',
                        id: 'titleField',
                        label: 'Title',
                        name: 't',
                        autoCapitalize: true,
                        placeHolder: 'Enter a title'
                    }, {
                        xtype: 'textareafield',
                        id: 'descriptionField',
                        label: 'Description',
                        name: 'd',
                        autoCapitalize: true,
                        placeHolder: 'Enter a description'
                    }, {
                        xtype: 'datepickerfield',
                        id: 'dateField',
                        label: 'Due on',
                        name: 'dd',
                        placeHolder: 'dd/mm/yyyy',
                        dateFormat: 'D d M Y',
                        value: new Date(),
                        picker: {
                            useTitles: true,
                            slotOrder: [
                                'day',
                                'month',
                                'year'
                            ],
                            yearFrom: (new Date()).getFullYear(),
                            yearTo: (new Date()).getFullYear() + 10
                        }
                    }, {
                        xtype: 'textfield',
                        id: 'startTimeField',
                        label: 'Start time',
                        name: 'st',
                        placeHolder: 'Enter start time'
                    }, {
                        xtype: 'textfield',
                        id: 'endTimeField',
                        label: 'End time',
                        name: 'et',
                        placeHolder: 'Enter end time'
                    }, {
                        xtype: 'togglefield',
                        id: 'allDayField',
                        label: 'All Day',
                        name: 'ad',
                        listeners:{                         
                           change: function(field, newValue){
                               st = Ext.getCmp('startTimeField'); 
                               et = Ext.getCmp('endTimeField');
                               if (field.getValue() == 1) {
                                   st.setValue('');
                                   st.disable();
                                   et.setValue('');
                                   et.disable();
                               } else {
                                   st.enable();
                                   et.enable();
                               }
                           }
                        }
                    }, {
                        xtype: 'togglefield',
                        id: 'completedField',
                        label: 'Done',
                        name: 'c'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                id: 'taskFormDeleteFieldset',
                instructions: 'This cannot be undone',
                title: 'Actions',
                items: [
                    {
                        xtype: 'button',
                        height: 44,
                        id: 'deleteButton',
                        ui: 'decline',
                        text: 'Delete this task',
                        action: 'deleteTask'
                    }
                ]
            }
        ]
    }
});
