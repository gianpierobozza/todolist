Ext.define('ToDoList.view.UserProfile', {
    extend: 'Ext.form.Panel',
    xtype: 'userprofile',
    requires: [
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Email',
        'Ext.field.Hidden'
    ],
    config: {
        id: 'userProfile',
        items: [
            {
                xtype: 'toolbar',
                id: 'userToolbar',
                title: {
                    title: 'User Profile',
                    centered: true
                },
                docked: 'top',
                ui: 'light',
                items: [
                    {
                        xtype: 'button',
                        ui: 'back',
                        iconMask: true,
                        text: 'Return',
                        action: 'returnToList'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        ui: 'action',
                        iconMask: true,
                        text: 'Save',
                        action: 'saveUserInfo'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                id: 'userFieldSet',
                instructions: 'User Details',
                title: 'User Details',
                items: [
                    {
                        xtype: 'hiddenfield',
                        id: 'userDbId',
                        name: '_id'
                    },
                    {
                        xtype: 'hiddenfield',
                        id: 'userProfileId',
                        name: 'u_id'
                    },
                    {
                        xtype: 'textfield',
                        id: 'nameField',
                        label: 'Name',
                        name: 'n',
                        autoCapitalize: true,
                        placeHolder: 'Your name'
                    }, {
                        xtype: 'textfield',
                        id: 'surnameField',
                        label: 'Surname',
                        name: 's',
                        autoCapitalize: true,
                        placeHolder: 'Your surname'
                    }, {
                        xtype: 'emailfield',
                        id: 'emailField',
                        label: 'E-mail',
                        name: 'e',
                        placeHolder: 'Your e-mail'
                    }, {
                        xtype: 'passwordfield',
                        id: 'passwordField',
                        label: 'Password',
                        name: 'p',
                        placeHolder: 'Your password'
                    }
                ]
            }
        ]
    }
});
