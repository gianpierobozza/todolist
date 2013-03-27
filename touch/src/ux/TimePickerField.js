Ext.define("Ext.ux.TimePickerField", {
    extend: "Ext.field.Text",
    xtype: "timepickerfield",

    constructor: function (config) {

// We're going to start by making string values of all of the times.

        var i,
            data = [],
            stringVal,
            that = this,

// Let's set some default options.

            startTime = config.startTime,
            endTime = parseInt(config.endTime, 10) || 2200,
            increment = parseInt(config.increment, 10) || 15,
            value = String(config.value) || "12:00 PM",

// This function should generate a human-readable time string based on the
// integer that's passed in.

            timeToString = function (n) {
                var hours = Math.floor(n / 100),
                    minutes = n % 100,
                    meridian = "AM";

                if (hours === 24 || hours === 0) {
                    hours = "12";
                } else if (hours >= 12) {
                    meridian = "PM";

                    if (hours > 12) {
                        hours = hours - 12;
                    }
                } else if (hours === 0) {
                    hours = "12";
                }

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                return "" + hours + ":" + minutes + " " + meridian;
            },

            sixtyMinusIncrement = 60 - increment,
            minuteWrap = 100 - sixtyMinusIncrement;

// This check is being done here because of the possibility of startTime being
// set to 0.

        if (startTime !== null && startTime !== undefined) {
            startTime = parseInt(startTime, 10);
        } else {
            startTime = 600;
        }

        i = startTime;

// Very basic parameter checking.

        if (endTime < startTime) {
            throw "The endTime cannot be less than startTime.";
        }

        if (endTime < 0) {
            throw "The endTime cannot be less than 0.";
        }

        if (startTime > 2400) {
            throw "The startTime cannot be greater than 2400.";
        }

// Loop from startTime to endTime to generate the list of times.

        while (i <= endTime) {
            stringVal = timeToString(i);

            data.push({
                text: stringVal,
                value: stringVal
            });

            if (i % 100 === sixtyMinusIncrement) {
                i = i + minuteWrap;
            } else {
                i = i + increment;
            }
        }

// Make the time picker...

        this.picker = Ext.create("Ext.Picker", {
            hidden: true,
            zIndex: 9999,

            slots: [{
                name: "time",
                title: "Select Time",
                data: data
            }],

            listeners: {
                change: function (picker, values) {
                    if (values && values.time !== null && values.time !== undefined) {
                        that.setValue(values.time);
                    } else {
                        that.setValue(value);
                    }
                }
            }
        });

        Ext.Viewport.add(this.picker);

// We want to release focus on the field so that the keyboard doesn't show up
// while we're picking a time.

        this.on("focus", function (field, e) {
            that.picker.show();
            field.blur();
        });

        this.callParent(arguments);
    }
});
