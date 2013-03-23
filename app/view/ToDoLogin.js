Ext.define('ToDoList.view.ToDoLogin', {
    extend: 'Ext.form.Panel',
    xtype: 'todologin',
    requires: [
        'Ext.form.FieldSet',
        'Ext.form.Password',
        'Ext.Label',
        'Ext.Img',
        'Ext.util.DelayedTask'
    ],
    config: {
        title: 'Login',
        id: 'toDoLogin',
        items: [
            {
                xtype: 'image',
                src: Ext.Viewport.getOrientation() === 'portrait' ?
                    'resources/images/login.png' :
                    'resources/images/login-small.png',
                style: Ext.Viewport.getOrientation() === 'portrait' ?
                    'width:80px;height:80px;margin:auto' :
                    'width:40px;height:40px;margin:auto'
            },
            {
                xtype: 'label',
                html: 'Login failed. Please enter the correct credentials.',
                itemId: 'signInFailedLabel',
                cls: 'signInFailedLabel',
                hidden: true,
                hideAnimation: 'fadeOut',
                showAnimation: 'fadeIn'
            },
            {
                xtype: 'fieldset',
                title: 'Enter your details',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'Username',
                        itemId: 'userNameTextField',
                        name: 'userNameTextField',
                        required: true
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: 'Password',
                        itemId: 'passwordTextField',
                        name: 'passwordTextField',
                        required: true
                    }
                ]
            },
            {
                xtype: 'button',
                itemId: 'logInButton',
                ui: 'action',
                padding: '10px',
                text: 'Log In',
                action: 'logInTap'
            }
        ]
    },
    showSignInFailedMessage: function (message) {
        var label = this.down('#signInFailedLabel');
        label.setHtml(message);
        label.show();
    }
});
