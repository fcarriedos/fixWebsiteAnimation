var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const nodemailer = require('nodemailer');
const dbclient = require('mongodb').MongoClient;

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


var outgoingEmailTemplate = {
    type: null,
    mailOptions: mailOptions
};


exports.sendWaitingListEmail = function sendWaitingListEmail(to) {
    console.log("email.sendWaitingListEmail(): Sending " + CONSTANTS.EMAIL_WAITINGLIST_TYPE + " to " + to);
    var outgoingEmailTemplate = getOutgoingEmailTemplate(to, CONSTANTS.EMAIL_WAITINGLIST_TYPE);
    sendEmail(outgoingEmailTemplate);
}


var getOutgoingEmailTemplate = function getOutgoingEmailTemplate(to, type) {
    var outgoingEmail = JSON.parse(JSON.stringify(outgoingEmailTemplate));
    var options = JSON.parse(JSON.stringify(mailOptions));
    options.to = to;
    switch(type) {

        case CONSTANTS.EMAIL_WAITINGLIST_TYPE: 
            outgoingEmail.type = CONSTANTS.EMAIL_WAITINGLIST_TYPE;
            options.subject = CONSTANTS.EMAIL_WAITINGLIST_SUBJECT;
            options.text = CONSTANTS.EMAIL_WAITINGLIST_TEXT_BODY;
            options.html = CONSTANTS.EMAIL_WAITINGLIST_HTML_BODY;
            break;

        default: console.log('email.getEmailTemplate()[ERROR]: un-recognized email type ' + type);
            break;

    }
    outgoingEmail.options = options;
    return outgoingEmail;
}


var sendEmail = function sendEmail(outgoingEmail) {
    emailTransporter.sendMail(outgoingEmail.options, function(err, info) {
        var sendingResult = ((err) ? false : true);
        if (err) {
            console.log("email.sendEmail()[ERROR]: Error sending mail " + outgoingEmail.type + " to " + outgoingEmail.options.to + " the waiting list " + err);
        } else {
            console.log("email.sendEmail(): Email " + outgoingEmail.options.to + " successfully sent to the waiting list");
        }
        recordSentEmailResult(outgoingEmail.options.to, outgoingEmail.type, sendingResult);
    });
}


var recordSentEmailResult = function recordSentEmailResult(to, emailType, result) {
    console.log('email.recordSentEmailResult(): recording email ' + emailType + ' to ' + to + '(' + result + ')');
    dbclient.connect(CONSTANTS.MONGODB_URL + CONSTANTS.DATABASE_NAME, function(dbConnectionErr, db) {
        if (dbConnectionErr) console.log('email.recordSentEmailResult(): could not connect to the database while sending ' + emailType + ' to ' + to);
        var dbo = db.db(CONSTANTS.DATABASE_NAME);
        var newEmailRecord = { 
            to: to,
            emailType: emailType,
            result: result
        };
        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).insertOne(newEmailRecord, function(insertErr, emailRecordingResult) {
            if (insertErr) console.log('email.recordSentEmailResult()[ERROR]: could not record ' + emailType + ' to ' + to);
            else console.log('email.recordSentEmailResult(): email ' + emailType + ' to ' + to + ' inserted.');
            db.close();
        });
    });
}


return module.exports;