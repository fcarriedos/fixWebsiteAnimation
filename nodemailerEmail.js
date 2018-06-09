var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const nodemailer = require('nodemailer');
const dbclient = require('mongodb').MongoClient;
const xoauth2 = require("xoauth2");

const xoauth2gen = xoauth2.createXOAuth2Generator({
    user: "francisco@messengersell.com",
    service: 'websiteapiaccess@messengersell-website.iam.gserviceaccount.com',
    scope: 'https://mail.google.com/',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9HfZWJHA/a5Wn\nTBauP5LAmjeLWYru+wzwRrrTk3V9aJ1myTSv3dh4CbdrqewmF9AeOyf/7pEfwCZ1\noP+NCEzGhspb8QJQ1haeeOf/jX3O+pT843d5/O2RYDesUAnH7eC6V/otDnsVS2Tm\n9NtXGmGHLIccrQjsdYlYurAUSnCbqroDBA0u239iYqxDztP/OeMmXb5sre7lRSNJ\njpUH4qa28RCf7YrfSLxkyQF2jkN3awfKP0G/uw+V1Hv8os7bOypEVH9Brr0eirnh\nnwVh2czPhnP8cjaXnxZ+d9g89tioZOEGOjP7WJKDh36EJVDsi0z2xQ/wQUB6xE8e\nIe4Zj7iVAgMBAAECggEACqakWAenVrsNa6WqZVfpQPWuiSea3oi/Gs0w+neEl3KL\n4t0UHY+GAISzktm4FhEjRICaaRybick9oURXAC9me4vd273AHqNgFL7Eei0S19Rf\nDbsV4IXxL03W9NpxIpRwIq6PxXfaUMG1RhimPcqbkYxdc6z/Iqof+SJShmIG441q\nB8mZncJu6xxtx+dKifjwJmkGfpmE5MgHAJE7JqzW5OFRRE/zz9dgs3HNOAMv7rh0\nrN8nHZCD0OZ7cw/KvUqmw/HzKpZYFBG9A+QMMlBzxSI2LQYXReDavbaCv6AooaaC\nIMTjIRjrDDC4JAraCjaF6kWtYjS3chUuonkktAwlIQKBgQD2z1GtfbicK4RAiPzq\nQqjWNnx0PrKMT5UMWO1aiJabf9Hst796yU5/kw7A7HnoUqTEshuSN7I1mFLcXDsH\nN61IJMfCYOXLqxm8iXIu11raeRx6k/cOJ6Ciz5ZuTUNkAAW3C+8NPAHev4x82mQ1\nUeKlX7Bw1NitYcJ7bwCZ4z5PiQKBgQDEKLHKemjSmZxCyRpKwABciSYZcm/xBmZg\njoqjKjIQgYcqus3+WDN9VZyFWvUUVewaosw564T5y/bQarSkZjb5URdOoZCCT5iW\nTefj5uer1EzAy7a3P11/pIda8hDLKQVcYbSDV14uzIcWI+TkC0HJuns5yITT0pC5\nSFtwSfTxrQKBgGq0a02koyHxtnXoQ+BL/Y7Pc7MWQD9lUL1L3SJdFzAXbPz43DIL\nwoJpY+GI25PT1ySrFDx9E/ET8A8RWPvf2Gzuaebh2bfaO4BFtDYIKWF3Jxbfzdoy\ny8JYGWOKx+3+DHp9EFcacHyLOAPqr5RV2LVCz5eYji03rMuMzCe8FX5xAoGAEayd\nAGJxKXCfzMCz9sJABhZxcV+HSI9MEC0nvrXhlu0k0avNPbqSwRtCpB1i8bcgM/Ix\nNpLLA3rmPTcwGZQAJgyxbetOyv8C/5/7YeR/QVM6qzBvwSkbcpHPhFlFPBjxG7bN\n/fuUR+Ez1sHbMNT204dS7QztMuzJD3i+jGqNgG0CgYEAwo43pi2SpcIU66R47X7i\nKSsi1wstj4XtykIbHb4dIiRMgck7UnntoedQ+l95KRdNbaL1g5koSAXG2lRRRPGG\nUayPw/24hXQ4jGuZI11ysfmz9x/fnmBoRqu26sUaDZym2YXyE1OCFtT2KVw7CzN9\nK3aQj9aj2KlZdZG8xpXQY9M=\n-----END PRIVATE KEY-----\n'
});


const authOptions = {
    // type: 'OAuth2',
    // user: 'francisco@messengersell.com',
    // serviceClient: '118397791348680915975',
    // privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9HfZWJHA/a5Wn\nTBauP5LAmjeLWYru+wzwRrrTk3V9aJ1myTSv3dh4CbdrqewmF9AeOyf/7pEfwCZ1\noP+NCEzGhspb8QJQ1haeeOf/jX3O+pT843d5/O2RYDesUAnH7eC6V/otDnsVS2Tm\n9NtXGmGHLIccrQjsdYlYurAUSnCbqroDBA0u239iYqxDztP/OeMmXb5sre7lRSNJ\njpUH4qa28RCf7YrfSLxkyQF2jkN3awfKP0G/uw+V1Hv8os7bOypEVH9Brr0eirnh\nnwVh2czPhnP8cjaXnxZ+d9g89tioZOEGOjP7WJKDh36EJVDsi0z2xQ/wQUB6xE8e\nIe4Zj7iVAgMBAAECggEACqakWAenVrsNa6WqZVfpQPWuiSea3oi/Gs0w+neEl3KL\n4t0UHY+GAISzktm4FhEjRICaaRybick9oURXAC9me4vd273AHqNgFL7Eei0S19Rf\nDbsV4IXxL03W9NpxIpRwIq6PxXfaUMG1RhimPcqbkYxdc6z/Iqof+SJShmIG441q\nB8mZncJu6xxtx+dKifjwJmkGfpmE5MgHAJE7JqzW5OFRRE/zz9dgs3HNOAMv7rh0\nrN8nHZCD0OZ7cw/KvUqmw/HzKpZYFBG9A+QMMlBzxSI2LQYXReDavbaCv6AooaaC\nIMTjIRjrDDC4JAraCjaF6kWtYjS3chUuonkktAwlIQKBgQD2z1GtfbicK4RAiPzq\nQqjWNnx0PrKMT5UMWO1aiJabf9Hst796yU5/kw7A7HnoUqTEshuSN7I1mFLcXDsH\nN61IJMfCYOXLqxm8iXIu11raeRx6k/cOJ6Ciz5ZuTUNkAAW3C+8NPAHev4x82mQ1\nUeKlX7Bw1NitYcJ7bwCZ4z5PiQKBgQDEKLHKemjSmZxCyRpKwABciSYZcm/xBmZg\njoqjKjIQgYcqus3+WDN9VZyFWvUUVewaosw564T5y/bQarSkZjb5URdOoZCCT5iW\nTefj5uer1EzAy7a3P11/pIda8hDLKQVcYbSDV14uzIcWI+TkC0HJuns5yITT0pC5\nSFtwSfTxrQKBgGq0a02koyHxtnXoQ+BL/Y7Pc7MWQD9lUL1L3SJdFzAXbPz43DIL\nwoJpY+GI25PT1ySrFDx9E/ET8A8RWPvf2Gzuaebh2bfaO4BFtDYIKWF3Jxbfzdoy\ny8JYGWOKx+3+DHp9EFcacHyLOAPqr5RV2LVCz5eYji03rMuMzCe8FX5xAoGAEayd\nAGJxKXCfzMCz9sJABhZxcV+HSI9MEC0nvrXhlu0k0avNPbqSwRtCpB1i8bcgM/Ix\nNpLLA3rmPTcwGZQAJgyxbetOyv8C/5/7YeR/QVM6qzBvwSkbcpHPhFlFPBjxG7bN\n/fuUR+Ez1sHbMNT204dS7QztMuzJD3i+jGqNgG0CgYEAwo43pi2SpcIU66R47X7i\nKSsi1wstj4XtykIbHb4dIiRMgck7UnntoedQ+l95KRdNbaL1g5koSAXG2lRRRPGG\nUayPw/24hXQ4jGuZI11ysfmz9x/fnmBoRqu26sUaDZym2YXyE1OCFtT2KVw7CzN9\nK3aQj9aj2KlZdZG8xpXQY9M=\n-----END PRIVATE KEY-----\n"
    xoauth2: xoauth2gen
};


const emailTransporter = nodemailer.createTransport({
    host: CONSTANTS.EMAIL_GMAIL_HOST,
    port: CONSTANTS.EMAIL_GMAIL_PORT,
    secure: CONSTANTS.EMAIL_GMAIL_SECURE,
    auth: authOptions
});


const mailOptions = {
    from: CONSTANTS.EMAIL_FROM_ADDRESS,
    to: CONSTANTS.EMAIL_TO_ADDRESS,
    subject: CONSTANTS.EMAIL_SUBJECT,
    text: CONSTANTS.EMAIL_TEXT_BODY,
    html: CONSTANTS.EMAIL_HTML_BODY
};


const outgoingEmailTemplate = {
    type: null,
    mailOptions: mailOptions
};


exports.getToken = function getToken() {
    xoauth2gen.getToken(function(err, token){
        if(err){
            return console.log(err);
        }
        console.log("AUTH XOAUTH2 " + token);
    });
}

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