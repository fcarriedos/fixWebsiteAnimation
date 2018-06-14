var exports = module.exports = {};

exports.WEBSITE_URL_ENDPOINT = WEBSITE_URL_ENDPOINT = 'http://9ad20535.ngrok.io'; 

// Email
exports.EMAIL_FROM_ADDRESS = EMAIL_FROM_ADDRESS = 'no-reply@messengersell.com';
exports.EMAIL_ETHEREAL_USERNAME = EMAIL_ETHEREAL_USERNAME = 'j3v6jcglpskqw5kk@ethereal.email';
exports.EMAIL_ETHEREAL_PASSWORD = EMAIL_ETHEREAL_PASSWORD = 'TXzcK1cgjqQDrHUzBf';
exports.EMAIL_ETHEREAL_HOST = EMAIL_ETHEREAL_HOST = 'smtp.ethereal.email';
exports.EMAIL_ETHEREAL_PORT = EMAIL_ETHEREAL_PORT = 587;
exports.EMAIL_ETHEREAL_SECURE = EMAIL_ETHEREAL_SECURE = false;
// Google STMP server settings
exports.EMAIL_GMAIL_HOST = EMAIL_GMAIL_HOST = 'smtp.gmail.com';
exports.EMAIL_GMAIL_PORT = EMAIL_GMAIL_PORT = 465;
exports.EMAIL_GMAIL_SECURE = EMAIL_GMAIL_SECURE = true;

// Email types
// Waiting list
exports.EMAIL_ACTIVATION_PLACEHOLDER = EMAIL_ACTIVATION_PLACEHOLDER = 'EMAILPLACEHOLDER';
exports.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER = EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER = 'EMAILREFERRALPLACEHOLDER';
exports.EMAIL_WAITINGLIST_TYPE = EMAIL_WAITINGLIST_TYPE = 'waitinglist';
exports.EMAIL_WAITINGLIST_SUBJECT = EMAIL_WAITINGLIST_SUBJECT = '💳 MessengerSell account ready!';
exports.EMAIL_ACTIVATION_LINK = EMAIL_ACTIVATION_LINK = '<a href="' + WEBSITE_URL_ENDPOINT + '/api/lead/confirm?email=' + EMAIL_ACTIVATION_PLACEHOLDER + '" target="blank">activate now!</a>';
exports.EMAIL_WAITINGLIST_TEXT_BODY = EMAIL_WAITINGLIST_TEXT_BODY = 'Please, open the link in your browser to confirm you email: ' + EMAIL_ACTIVATION_LINK;
exports.EMAIL_WAITINGLIST_HTML_BODY = EMAIL_WAITINGLIST_HTML_BODY = 'Please, click the link to confirm your email: ' + EMAIL_ACTIVATION_LINK;
exports.EMAIL_ACTIVATION_SUCCESS_HTML_BODY = EMAIL_ACTIVATION_SUCCESS_HTML_BODY = '<h2>Done! 🙌</h2> You have confirmed your email address and will be included in the early access group. Thanks a lot for giving us a try! 🙇. Get free credit  <a href="' + WEBSITE_URL_ENDPOINT + '/r?r=' + EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER + '">referring us</a>';
exports.EMAIL_ACTIVATION_ALREADY_HTML_BODY = EMAIL_ACTIVATION_ALREADY_HTML_BODY = '<h2>This email was already confirmed!</h2>But thanks for letting us know again! 👍';
exports.EMAIL_ACTIVATION_ERROR_HTML_BODY = EMAIL_ACTIVATION_ERROR_HTML_BODY = '<h2>Sorry! 🤦</h2> An error happened and we could not activate your email. Could you please try again later? 🙏 Thanks a lot for your understanding! 🙇';

// Database
// exports.MONGODB_URL = MONGODB_URL = "mongodb://localhost:27017/";
exports.MONGODB_URL = MONGODB_URL = "mongodb://heroku_vhf8lww8:qdat1khaevi73ltfatniio4208@ds259250.mlab.com:59250/heroku_vhf8lww8";
exports.DATABASE_NAME = DATABASE_NAME = "website";
exports.SENT_EMAILS_TABLE = SENT_EMAILS_TABLE = "sentemails";

// Encryption
exports.ENCRYPTION_KEY = ENCRYPTION_KEY = JSON.parse(process.env.ENC_KEY);
exports.ENCRIPTION_AES_COUNTER = ENCRIPTION_AES_COUNTER = 5;

return module.exports;