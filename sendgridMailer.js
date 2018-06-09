var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const sgMail = require('@sendgrid/mail');
const dbclient = require('mongodb').MongoClient;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const message = {
  to: null,
  from: null,
  fromname: null,
  subject: null,
  text: null,
  html: null,
};


const outgoingEmailTemplate = {
    type: null,
    message: message
};


exports.sendWaitingListEmail = function sendWaitingListEmail(to) {
    console.log("sendgridMailer.sendWaitingListEmail(): Sending " + CONSTANTS.EMAIL_WAITINGLIST_TYPE + " to " + to);
    var outgoingEmailTemplate = getOutgoingEmailTemplate(to, CONSTANTS.EMAIL_WAITINGLIST_TYPE);
    sendEmail(outgoingEmailTemplate);
}


var getOutgoingEmailTemplate = function getOutgoingEmailTemplate(to, type) {
    var outgoingEmail = JSON.parse(JSON.stringify(outgoingEmailTemplate));
    var outgoingMessage = JSON.parse(JSON.stringify(message));
    outgoingMessage.to = to;
    switch(type) {

        case CONSTANTS.EMAIL_WAITINGLIST_TYPE: 
            outgoingEmail.type = CONSTANTS.EMAIL_WAITINGLIST_TYPE;
            outgoingMessage.subject = CONSTANTS.EMAIL_WAITINGLIST_SUBJECT;
            outgoingMessage.text = CONSTANTS.EMAIL_WAITINGLIST_TEXT_BODY;
            outgoingMessage.html = CONSTANTS.EMAIL_WAITINGLIST_HTML_BODY;
            break;

        default: console.log('sendgridMailer.getEmailTemplate()[ERROR]: un-recognized email type ' + type);
            break;

    }
    outgoingEmail.message = outgoingMessage;
    return outgoingEmail;
}


var sendEmail = function sendEmail(outgoingEmail) {
    sgMail.send(outgoingEmail.message,function(err, info) {
        var sendingResult = ((err) ? false : true);
        if (err) {
            console.log("sendgridMailer.sendEmail()[ERROR]: Error sending mail " + outgoingEmail.type + " to " + outgoingEmail.message.to + " the waiting list " + err);
        } else {
            console.log("sendgridMailer.sendEmail(): Email " + outgoingEmail.message.to + " successfully sent to the waiting list");
        }
        recordSentEmailResult(outgoingEmail.message.to, outgoingEmail.type, sendingResult);
    });
}


var recordSentEmailResult = function recordSentEmailResult(to, emailType, result) {
    console.log('sendgridMailer.recordSentEmailResult(): recording email ' + emailType + ' to ' + to + '(' + result + ')');
    dbclient.connect(CONSTANTS.MONGODB_URL + CONSTANTS.DATABASE_NAME, function(dbConnectionErr, db) {
        if (dbConnectionErr) console.log('sendgridMailer.recordSentEmailResult(): could not connect to the database while sending ' + emailType + ' to ' + to);
        var dbo = db.db(CONSTANTS.DATABASE_NAME);
        var newEmailRecord = { 
            to: to,
            emailType: emailType,
            result: result
        };
        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).insertOne(newEmailRecord, function(insertErr, emailRecordingResult) {
            if (insertErr) console.log('sendgridMailer.recordSentEmailResult()[ERROR]: could not record ' + emailType + ' to ' + to);
            else console.log('sendgridMailer.recordSentEmailResult(): email ' + emailType + ' to ' + to + ' inserted.');
            db.close();
        });
    });
}


return module.exports;