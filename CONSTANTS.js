var exports = module.exports = {};

const fs = require('fs');

exports.WEBSITE_URL_ENDPOINT = WEBSITE_URL_ENDPOINT = process.env.WEBSITE_URL_ENDPOINT || 'http://cb3094d2.ngrok.io'; 

// Email constants
exports.NAME_PLACEHOLDER = NAME_PLACEHOLDER = 'NAME_PLACEHOLDER';
exports.EMAIL_PLACEHOLDER = EMAIL_PLACEHOLDER = 'EMAIL_PLACEHOLDER';
exports.MESSAGE_PLACEHOLDER = MESSAGE_PLACEHOLDER = 'MESSAGE_PLACEHOLDER';

// Lead email
exports.EMAIL_CONTACT_ADDRESS = EMAIL_CONTACT_ADDRESS = 'contact@messengersell.com';
exports.EMAIL_FROM_ADDRESS = EMAIL_FROM_ADDRESS = 'no-reply@messengersell.com';
exports.EMAIL_ACTIVATION_TOKEN_PLACEHOLDER = EMAIL_ACTIVATION_TOKEN_PLACEHOLDER = 'EMAILACTIVACTIONTOKENPLACEHOLDER';
exports.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER = EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER = 'EMAILREFERRALPLACEHOLDER';
exports.WEBSITE_URL_ENDPOINT_PLACEHOLDER = WEBSITE_URL_ENDPOINT_PLACEHOLDER = 'WEBSITEURLENDPOINTPLACEHOLDER';
exports.EMAIL_WAITINGLIST_TYPE = EMAIL_WAITINGLIST_TYPE = 'waitinglist';
exports.EMAIL_WAITINGLIST_SUBJECT = EMAIL_WAITINGLIST_SUBJECT = '💳 MessengerSell account ready!';
exports.EMAIL_ACTIVATION_LINK = EMAIL_ACTIVATION_LINK = '<a href="' + WEBSITE_URL_ENDPOINT + '/api/lead/confirm?token=' + EMAIL_ACTIVATION_TOKEN_PLACEHOLDER + '" target="blank">activate now!</a>';
exports.EMAIL_REFERRAL_URL = EMAIL_REFERRAL_URL = WEBSITE_URL_ENDPOINT + '/r/' + EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER;
exports.EMAIL_REFERRAL_LINK = EMAIL_REFERRAL_LINK = '<a href="' + EMAIL_REFERRAL_URL + '">refer us</a>';
exports.EMAIL_WAITINGLIST_TEXT_BODY = EMAIL_WAITINGLIST_TEXT_BODY = 'From MessengerSell.com, please open the link in your browser to confirm you email: ' + EMAIL_ACTIVATION_LINK;
// exports.EMAIL_WAITINGLIST_HTML_BODY = EMAIL_WAITINGLIST_HTML_BODY = 'Please, click the link to confirm your email: ' + EMAIL_ACTIVATION_LINK;
exports.EMAIL_WAITINGLIST_HTML_BODY = EMAIL_WAITINGLIST_HTML_BODY = fs.readFileSync(__dirname + '/public/email/index.html').toString();
exports.EMAIL_ACTIVATION_SUCCESS_HTML_BODY = EMAIL_ACTIVATION_SUCCESS_HTML_BODY = '<h2>Done! 🙌</h2> You have confirmed your email address and will be included in the early access group. Thanks a lot for giving us a try! 🙇. Get free credit, ' + EMAIL_REFERRAL_LINK;
exports.EMAIL_ACTIVATION_ALREADY_HTML_BODY = EMAIL_ACTIVATION_ALREADY_HTML_BODY = '<h2>This email was already confirmed!</h2>But thanks for letting us know again! 👍';
exports.EMAIL_ACTIVATION_ERROR_HTML_BODY = EMAIL_ACTIVATION_ERROR_HTML_BODY = '<h2>Sorry! 🤦</h2> An error happened and we could not activate your email. Could you please try again later? 🙏 Thanks a lot for your understanding! 🙇';

// Contact email
exports.EMAIL_CONTACT_TYPE = EMAIL_CONTACT_TYPE = 'CONTACT_EMAIL_TYPE';
exports.EMAIL_CONTACT_SUBJECT = EMAIL_CONTACT_SUBJECT = '💳 MessengerSell - Message received';
exports.EMAIL_CONTACT_TEXT_BODY = EMAIL_CONTACT_TEXT_BODY = 'Message from ' + NAME_PLACEHOLDER + '(' + EMAIL_PLACEHOLDER + '): ' + MESSAGE_PLACEHOLDER;

// Database
// Heroku Mongo URL: "mongodb://heroku_vhf8lww8:qdat1khaevi73ltfatniio4208@ds259250.mlab.com:59250/heroku_vhf8lww8";
exports.MONGODB_URL = MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/website';
exports.WEBSITE_DATABASE_NAME = WEBSITE_DATABASE_NAME = MONGODB_URL.split('/')[3];

exports.SENT_EMAILS_TABLE = SENT_EMAILS_TABLE = "leademails";
exports.CONTACTS_TABLE = CONTACTS_TABLE = "contactemails";

// Encryption
exports.ENCRYPTION_KEY = ENCRYPTION_KEY = JSON.parse(process.env.ENC_KEY);
exports.ENCRIPTION_AES_COUNTER = ENCRIPTION_AES_COUNTER = 5;

return module.exports;