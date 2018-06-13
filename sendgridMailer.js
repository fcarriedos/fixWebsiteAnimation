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


exports.confirmEmail = function confirmEmail(emailToConfirm, res) {
    console.log('sendgridMailer.confirmEmail(): confirming email ' + emailToConfirm);
    dbclient.connect(CONSTANTS.MONGODB_URL + CONSTANTS.DATABASE_NAME, function(dbConnectionErr, db) {
    if (dbConnectionErr) console.log('sendgridMailer.confirmEmail(): could not connect to the database while confirming ' + emailToConfirm);
        
        var dbo = db.db(CONSTANTS.DATABASE_NAME);
        
        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOneAndUpdate(
            { email: emailToConfirm },
            { $set: { email_confirmed: true }}, function(updateError, oldVersion) {
                var responseToSend = null;
                if(updateError) {
                    console.log('sendgridMailer.confirmEmail(): error confirming email ' + updateError);
                    responseToSend = CONSTANTS.EMAIL_ACTIVATION_ERROR_HTML_BODY;
                } else {
                    console.log('sendgridMailer.confirmEmail(): successfully confirmed email ' + emailToConfirm);
                    responseToSend = CONSTANTS.EMAIL_ACTIVATION_SUCCESS_HTML_BODY;
                }
                return res.send(responseToSend);
            });

        db.close();

    });
}


exports.sendReferralEmail = function sendReferralEmail(to, res) {
    console.log("sendgridMailer.sendReferralEmail(): Sending " + CONSTANTS.EMAIL_WAITINGLIST_TYPE + " to " + to);
    var outgoingEmailTemplate = getOutgoingEmailTemplate(to, CONSTANTS.EMAIL_WAITINGLIST_TYPE);
    sendEmail(outgoingEmailTemplate, res);
}


exports.sendWaitingListEmail = function sendWaitingListEmail(to, res) {
    console.log("sendgridMailer.sendWaitingListEmail(): Sending " + CONSTANTS.EMAIL_WAITINGLIST_TYPE + " to " + to);
    var outgoingEmailTemplate = getOutgoingEmailTemplate(to, CONSTANTS.EMAIL_WAITINGLIST_TYPE);
    sendEmail(outgoingEmailTemplate, res);
}


var getOutgoingEmailTemplate = function getOutgoingEmailTemplate(to, type) {
    var outgoingEmail = JSON.parse(JSON.stringify(outgoingEmailTemplate));
    var outgoingMessage = JSON.parse(JSON.stringify(message));
    outgoingMessage.to = to;
    outgoingMessage.from = CONSTANTS.EMAIL_FROM_ADDRESS;
    switch(type) {

        case CONSTANTS.EMAIL_WAITINGLIST_TYPE: 
            outgoingEmail.type = CONSTANTS.EMAIL_WAITINGLIST_TYPE;
            outgoingMessage.subject = CONSTANTS.EMAIL_WAITINGLIST_SUBJECT;
            outgoingMessage.text = CONSTANTS.EMAIL_WAITINGLIST_TEXT_BODY.replace(CONSTANTS.EMAIL_ACTIVATION_PLACEHOLDER, to);
            outgoingMessage.html = CONSTANTS.EMAIL_WAITINGLIST_HTML_BODY.replace(CONSTANTS.EMAIL_ACTIVATION_PLACEHOLDER, to);
            break;

        case CONSTANTS.EMAIL_REFERRAL_TYPE: 
            outgoingEmail.type = CONSTANTS.EMAIL_REFERRAL_TYPE;
            outgoingMessage.subject = CONSTANTS.EMAIL_REFERRAL_SUBJECT;
            outgoingMessage.text = CONSTANTS.EMAIL_REFERRAL_TEXT_BODY;
            outgoingMessage.html = CONSTANTS.EMAIL_REFERRAL_HTML_BODY;
            break;

        default: console.log('sendgridMailer.getEmailTemplate()[ERROR]: un-recognized email type ' + type);
            break;

    }
    outgoingEmail.message = outgoingMessage;
    return outgoingEmail;
}


var sendEmail = function sendEmail(outgoingEmail, res) {
    console.log(JSON.stringify(outgoingEmail, null, 2));
    sgMail.send(outgoingEmail.message,function(err, info) {
        var sendingResult = ((err) ? false : true);
        if (err) {
            console.log("sendgridMailer.sendEmail()[ERROR]: Error sending mail " + outgoingEmail.type + " to " + outgoingEmail.message.to + " the waiting list " + err);
        } else {
            console.log("sendgridMailer.sendEmail(): Email " + outgoingEmail.message.to + " successfully sent to the waiting list");
        }
        recordSentEmailResult(outgoingEmail.message.to, outgoingEmail.type, sendingResult, res);
    });
}


var recordSentEmailResult = function recordSentEmailResult(to, emailType, result, res) {
    console.log('sendgridMailer.recordSentEmailResult(): recording email ' + emailType + ' to ' + to + '(' + result + ')');
    dbclient.connect(CONSTANTS.MONGODB_URL + CONSTANTS.DATABASE_NAME, function(dbConnectionErr, db) {
    if (dbConnectionErr) console.log('sendgridMailer.recordSentEmailResult(): could not connect to the database while sending ' + emailType + ' to ' + to);
        
        var dbo = db.db(CONSTANTS.DATABASE_NAME);
        var newEmailRecord = {
            // Id and timestamp coming from MongoDb 'ObjectId' object.
            email: to,
            emailType: emailType,
            sendingResult: result,
            email_confirmed: false,
            referral_id: null
        };

        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).insertOne(newEmailRecord, function(insertErr, emailRecordingResult) {
            if (insertErr) {
                console.log('sendgridMailer.recordSentEmailResult()[ERROR]: could not record ' + emailType + ' to ' + to);
                return res.status(500).json({ code: 500, messages: ['could not record email'] });
            } else {
                console.log('sendgridMailer.recordSentEmailResult(): email ' + emailType + ' to ' + to + ' inserted.');
                return res.status(200).json({ code: 200, messages: ['ok'] });
            }
        });

        db.close();

    });
}


return module.exports;