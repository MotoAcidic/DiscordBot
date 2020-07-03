// Copyright 2020 Precision Electric Motor Sales

    const config = require('../config.js');
    const nodemailer = require("nodemailer");
    var currentDay = new Date().getDay(); // Current day 0-6 (0 = sunday monday = 1)
    var currentHour = new Date().getHours(); // Current hours of the 0-23  (0 = midnight 1am = 1)
    var curretDate = new Date();
    var timeStamp = curretDate.toLocaleString();
    var officeOpen = config.hoursOfOperation.mainOfficeOpen;
    var officeClose = config.hoursOfOperation.mainOfficeClose;
    /*
     Days of the Week.
     Sunday = 0, Monday = 1, Tuesday = 2, Wensday = 3, Thursday = 4, Friday = 5, Saturday = 6

     Hours of the Day.
     0 = Midnight, 1 = 1am, 12 = Noon, 18 = 6pm, 23 = 11pm
     */

    module.exports = {
        command_sendEmail: function emailAlert() {

            if (currentDay === 0 || currentDay === 6) {
                console.log('Sanity Check ' + currentDay + ' ' + currentHour);
                console.log('Its the weekend.  ' + timeStamp);

                // Restart the timer since its the weekend
                var weekendTimer = emailAlert;
                global.globalTimer = setTimeout(weekendTimer, 1800000); // 30 mins
                console.log('Restarted the timer since its the weekend and we dont like spam.  ' + timeStamp);

            } else
                if (currentDay > 0 && currentDay < 6 && currentHour > officeOpen && currentHour < officeClose) {
                    // We use 17 as our end of day because it will read anything in 1700 as during work hours
                    console.log('Sanity Check ' + currentDay + ' ' + currentHour);
                    console.log('During Business Hours and Alerts hasnt send anything to FolderMill to print in 30 minutes!  ' + timeStamp);

                    // Send out the email to department heads
                    var transporter = nodemailer.createTransport({
                        service: config.emailsettings.service,
                        auth: {
                            user: config.emailsettings.user,
                            pass: config.emailsettings.pass
                        }
                    });

                    var mailOptions = {
                        from: config.emailsettings.from,
                        to: config.emailsettings.to,
                        subject: 'Pick Ticket Monitor Alert',
                        text: 'No warehouse has received Pick Tickets in 30 minutes. /n' +
                            'To fix the issue do the following on Pems-appsrv-3' +
                            'Open up services and find Knowledge sync and Stop the Service. Don’t just Restart it!' +
                            'Then open up Task Manager and click on the Details Tab.' +
                            'Look for anything starting with KS & the user is SAU & kill them. This is the hangup with Alerts.' +
                            'If you see Administrator or LWA as the user, that is someone actually in, so ask them to exit before you blow them away & they / we lose any work.' +
                            'Start the service.' +
                            'You should now see things start to pick back up & process.' +
                            'Example Process under Details Tab are the following:' +
                            'KS_Report.exe'

                    };

                    transporter.sendMail(mailOptions, function (err, data) {
                        if (err) {
                            console.log('Errors have occured and Email was not sent!');
                        } else {
                            conssole.log('Email has been sent out to the people who need to be informed!');

                        }
                    });

                    var generalChat = globalClient.channels.get(config.channels.generalChat);

                    generalChat.send({
                        embed: {
                            color: 0x2ecc71,
                            title: "Pick Ticket Alert",
                            fields: [{
                                name: "Pick Tickets havent printed in over:",
                                value: '30 minutes, check sage alerts!'
                            }],
                            timestamp: new Date(),
                            footer: {
                                text: "Current Time"
                            }
                        }
                    });

                    // Restart the timer if alert has been triggered
                    var weekdayTimer = emailAlert;
                    global.globalTimer = setTimeout(weekdayTimer, 1800000);
                    console.log('Sanity Check ' + currentDay + ' ' + currentHour);
                    console.log("Restarted the timer incase issue still is ative with Sage Alerts!");


                } else
                    if (currentDay > 0 && currentDay < 6 && currentHour < officeOpen && currentHour > officeClose) {
                        var outOfHoursTimer = emailAlert;
                        global.globalTimer = setTimeout(outOfHoursTimer, 1800000);
                        console.log('Sanity Check ' + currentDay + ' ' + currentHour);
                        console.log("Outside of Operating hours, will start a new timer!");
                    } else {
                        console.log('Sanity Check ' + currentDay + ' ' + currentHour);
                        console.log('We should never make it to this point.')
                        var neverHappenTimer = emailAlert;
                        global.globalTimer = setTimeout(neverHappenTimer, 1800000);
                    }
        }

    }