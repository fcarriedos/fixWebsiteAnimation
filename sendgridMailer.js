var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const sgMail = require('@sendgrid/mail');
const encryptionUtility = require('./encryptionUtility.js');
const crc = require('crc');
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
    confirmationHash: null,
    message: message
};


exports.confirmEmail = function confirmEmail(email, res) {
    console.log('sendgridMailer.confirmEmail(): confirming email ' + email);
    dbclient.connect(CONSTANTS.MONGODB_URL, function(dbConnectionErr, db) {
    if (dbConnectionErr) console.log('sendgridMailer.confirmEmail(): could not connect to the database while confirming ' + email);
        
        var dbo = db.db(CONSTANTS.WEBSITE_DATABASE_NAME);

        var updateProjection = ({ $set: { email_confirmed: true }}); 
        
        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOneAndUpdate(
            { email: email, "email_confirmed": false },
            updateProjection,
            function(updateError, oldVersion) {
                console.log('sendgridMailer.confirmEmail(): previous object ' + JSON.stringify(oldVersion));
                var responseToSend = null;
                if(updateError) {
                    console.log('sendgridMailer.confirmEmail(): error confirming email ' + updateError);
                    responseToSend = CONSTANTS.EMAIL_ACTIVATION_ERROR_HTML_BODY;
                } else {
                    if (oldVersion.value == null) {
                        console.log('sendgridMailer.confirmEmail(): email was tried to be confirmed again ' + email + ' or not existing email at all.');
                        responseToSend = CONSTANTS.EMAIL_ACTIVATION_ALREADY_HTML_BODY;
                    } else {
                        console.log('sendgridMailer.confirmEmail(): successfully confirmed email ' + email);
                        var userId = oldVersion.value['_id'];
                        // var userDatastructure = getUserDatastructure(userId);
                        responseToSend = CONSTANTS.EMAIL_ACTIVATION_SUCCESS_HTML_BODY.replace(CONSTANTS.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER, getReferralToken(email));
                    }
                }
                return res.send(responseToSend);
            });
            db.close();
        });
}


exports.sendWaitingListEmail = function sendWaitingListEmail(name, to, refererId, res) {
    console.log("sendgridMailer.sendWaitingListEmail(): Sending " + CONSTANTS.EMAIL_WAITINGLIST_TYPE + " to " + to);
    var outgoingEmail = getOutgoingEmailTemplate(to, CONSTANTS.EMAIL_WAITINGLIST_TYPE);
    sendEmail(outgoingEmail, name, res, refererId);
}


var getOutgoingEmailTemplate = function getOutgoingEmailTemplate(to, type, refererName, refererEmail) {

    var outgoingEmail = JSON.parse(JSON.stringify(outgoingEmailTemplate));
    var confirmationHash = getConfirmationHash(to); // Get string as HEX
    outgoingEmail.confirmationHash = confirmationHash;

    var outgoingMessage = JSON.parse(JSON.stringify(message));
    outgoingMessage.to = to;
    outgoingMessage.from = CONSTANTS.EMAIL_FROM_ADDRESS;

    switch(type) {

        case CONSTANTS.EMAIL_WAITINGLIST_TYPE: 
            outgoingEmail.type = CONSTANTS.EMAIL_WAITINGLIST_TYPE;
            outgoingMessage.subject = CONSTANTS.EMAIL_WAITINGLIST_SUBJECT;
            outgoingMessage.text = CONSTANTS.EMAIL_WAITINGLIST_TEXT_BODY.replace(CONSTANTS.EMAIL_ACTIVATION_PLACEHOLDER, confirmationHash);
            outgoingMessage.html = CONSTANTS.EMAIL_WAITINGLIST_HTML_BODY.replace(CONSTANTS.EMAIL_ACTIVATION_PLACEHOLDER, confirmationHash);
            break;

        default: console.log('sendgridMailer.getEmailTemplate()[ERROR]: un-recognized email type ' + type);
            break;

    }

    outgoingEmail.message = outgoingMessage;
    return outgoingEmail;
}


var sendEmail = function sendEmail(outgoingEmail, name, res, refererId) {
    console.log(JSON.stringify(outgoingEmail, null, 2));
    sgMail.send(outgoingEmail.message,function(err, info) {
        var sendingResult = ((err) ? false : true);
        if (err) {
            console.log("sendgridMailer.sendEmail()[ERROR]: Error sending mail " + outgoingEmail.type + " to " + outgoingEmail.message.to + " the waiting list " + err);
        } else {
            console.log("sendgridMailer.sendEmail(): Email " + outgoingEmail.message.to + " successfully sent to the waiting list");
        }
        recordSentEmailResult(name, outgoingEmail.message.to, outgoingEmail.type, outgoingEmail.confirmationHash , sendingResult, res, refererId);
    });
}


var recordSentEmailResult = function recordSentEmailResult(name, to, emailType, confirmationHash, result, res, refererId) {
    console.log('sendgridMailer.recordSentEmailResult(): recording email ' + emailType + ' to ' + to + '(' + result + ')');
    dbclient.connect(CONSTANTS.MONGODB_URL, function(dbConnectionErr, db) {
    
        if (dbConnectionErr) console.log('sendgridMailer.recordSentEmailResult(): could not connect to the database while recording email sending ' + emailType + ' to ' + to);
        
        var dbo = db.db(CONSTANTS.WEBSITE_DATABASE_NAME);
        var newEmailRecord = {
            // Id and timestamp coming from MongoDb 'ObjectId' object.
            name: name,
            email: to,
            emailType: emailType,
            sendingResult: result,
            email_confirmed: false,
            confirmation_hash: confirmationHash,
            referral_hash: getReferralToken(to),
            referral_id: refererId
        };

        console.log('sendgridMailer.recordSentEmailResult(): ' + JSON.stringify(newEmailRecord, null, 2));

        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).insertOne(newEmailRecord, function(insertErr, emailRecordingResult) {
            var userId = emailRecordingResult.ops[0]['_id'];
            if (insertErr) {
                console.log('sendgridMailer.recordSentEmailResult()[ERROR]: could not record ' + emailType + ' to ' + to);
                sendResultResponse(500, 500, ['could not record email']);
            } else {
                console.log('sendgridMailer.recordSentEmailResult(): email ' + emailType + ' to ' + to + ' inserted.');
                sendResultResponse(200, 200, ['ok'], newEmailRecord.referral_hash, res); 
            }
        });

        db.close();

    });
}


var sendResultResponse = function sendResultResponse(httpStatus, code, messages, referralToken, res) {
    if (res) { // response could be sent somewhere else
        return res.status(httpStatus).json({ code: code, messages: messages, referral: CONSTANTS.EMAIL_REFERRAL_URL.replace(CONSTANTS.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER, referralToken) });
    }
}


var getUserDatastructure = exports.getUserDatastructure = function getUserDatastructure(userId) {
    var userDatastructure = { id: userId };
    if (userId) userDatastructure.id = userId;
    var stringVersion = JSON.stringify(userDatastructure);
    console.log('sendgridMailer.getUserDatastructure():  returning datastructure: ' + stringVersion);
    return stringVersion;
}


var getConfirmationHash = function getConfirmationHash(userEmail) {
    return getReferralToken(userEmail + Date.now());
}


var getReferralToken = function getReferralToken(userEmail) {
    return crc.crc32(userEmail).toString(16);
}


return module.exports;