var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const nodemailer = require('nodemailer');

var emailTransporter = nodemailer.createTransport({
    host: CONSTANTS.EMAIL_ETHEREAL_HOST,
    port: CONSTANTS.EMAIL_ETHEREAL_PORT,
    secure: CONSTANTS.EMAIL_ETHEREAL_SECURE,
    auth: {
        user: CONSTANTS.EMAIL_ETHEREAL_USERNAME,
        pass: CONSTANTS.EMAIL_ETHEREAL_PASSWORD
    }
});

var mailOptions = {
    from: CONSTANTS.EMAIL_FROM_ADDRESS,
    to: CONSTANTS.EMAIL_TO_ADDRESS,
    subject: CONSTANTS.EMAIL_SUBJECT,
    text: CONSTANTS.EMAIL_TEXT_BODY,
    html: CONSTANTS.EMAIL_HTML_BODY
};

var sendEmail = exports.sendEmail = function sendEmail(to, res) {
    console.log("Sending " + to + " to waiting list.");
    emailTransporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log("sendEmail(): Error sending mail " + to + " to the waiting list " + err);
            res.status(CONSTANTS.EMAIL_HTTP_ERROR_CODE).send('Could not send the email.');
        } else {
            console.log("sendEmail(): Email " + to + " successfully sent to the waiting list");
            res.sendStatus(200);
        }
    });
}

return module.exports;