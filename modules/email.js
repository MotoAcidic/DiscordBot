// Copyright 2020 Precision Electric Motor Sales

    const config = require('../config.js');
    const nodemailer = require("nodemailer");

    /*
     Days of the Week.
     Sunday = 0, Monday = 1, Tuesday = 2, Wensday = 3, Thursday = 4, Friday = 5, Saturday = 6

     Hours of the Day.
     0 = Midnight, 1 = 1am, 12 = Noon, 18 = 6pm, 23 = 11pm
     */

    module.exports = {
        command_sendEmail: function emailAlert() {

            if (global.globalDay === 6 || global.globalDay === 0) {
                console.log('Its the weekend.');

                // Restart the timer since its the weekend
                var weekendTimer = emailAlert;
                global.globalTimer = setTimeout(weekendTimer, 1800000); // 30 mins
                console.log("Restarted the timer since its the weekend and we dont like spam");

            } else
                if (global.globalDay > 0 && global.globalDay < 6 && global.globalHours > 8 && global.globalHours < 17) {
                    // We use 17 as our end of day because it will read anything in 1700 as during work hours
                        console.log('During Business Hours!');

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
                            subject: 'Pick Ticket Monitor',
                            text: 'Pick Tickets havent printed in over 30 minutes.'
                        };

                        transporter.sendMail(mailOptions, function (err, data) {
                            if (err) {
                                console.log('Errors have occured');
                            } else {
                                conssole.log('Email has been sent out!');

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
                        console.log("Restarted the timer incase issue still is ative with Sage Alerts!");


                } else {
                    var outOfHoursTimer = emailAlert;
                    global.globalTimer = setTimeout(outOfHoursTimer, 1800000);
                    console.log("Outside of Operating hours, will start a new timer!");
                }
        }

    }