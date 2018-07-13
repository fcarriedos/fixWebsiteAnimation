var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');


var sendResultResponse = exports.sendResultResponse = function sendResultResponse(httpStatus, errorCode, messages, referralToken, res) {
    if (res) { // response could be sent somewhere else
        if (isBotResponse(res)) { // Chatfuel bot format responses
            sendChatfuelBotResponse(errorCode, referralToken, messages, res);
        } else { // Web format responses
			sendWebResponse(httpStatus, errorCode, messages, referralToken, res);           
        }
    }
}


var sendChatfuelBotResponse = exports.sendChatfuelBotResponse = function sendChatfuelBotResponse(errorCode, referralToken, messages, res) {
	switch(errorCode) {
		case 200: var referralLink = CONSTANTS.EMAIL_REFERRAL_URL.replace(CONSTANTS.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER, referralToken);
    			  res.status(CONSTANTS.CHATFUEL_HTTP_STATUS_CODE).json({"set_attributes":{"referral_link": referralLink}, "redirect_to_blocks": ["Lead recorded"]});
			break;
		case 422: // Input could not be validated
		case 409: // User already exists
		case 500: // Something went wrong
				  res.status(CONSTANTS.CHATFUEL_HTTP_STATUS_CODE).json({"set_attributes":{"errors": formatErrorMessagesForBot(messages)}, "redirect_to_blocks": ["Error happened"]});
			break;
	}

}


var sendWebResponse = exports.sendWebResponse = function sendWebResponse(httpStatus, code, messages, referralToken, res) {
	var response = { code: code, messages: messages };
	if (referralToken) {
        response.referral = CONSTANTS.EMAIL_REFERRAL_URL.replace(CONSTANTS.EMAIL_ACTIVATION_REFERRAL_PLACEHOLDER, referralToken);
    }
    return res.status(httpStatus).json(response);
}


var isBotResponse = function isBotResponse(res) {
	return res.getHeaders()['botresponsetype'];
}


var formatErrorMessagesForBot = function formatErrorMessagesForBot(theErrors) {
	var jointMessages = '';
  for (var key in theErrors) {
    //console.log(key + ' -> ' + theErrors[key]['param'] + theErrors[key]['msg']);
  	jointMessages = jointMessages.concat(theErrors[key]['msg'] + ', ');
    console.log('Concatenating: ' + jointMessages);
  }
  return jointMessages.slice(0, -2);
}


return module.exports;