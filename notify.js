'use strict';
const nodemailer = require('nodemailer');

// create reusable transport object using the default SMTP transport
let transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.HOTMAIL_SMTP_USERNAME,
        pass: process.env.HOTMAIL_SMTP_PASSWORD
    }
});

exports.send = (opts) => {
    transport.sendMail(opts, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
