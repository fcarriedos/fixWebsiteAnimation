var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');


exports.subscribe = function subscribe(subscriberData, period, paymentMethod) {

	console.log('Subscribe invoked!');
	// 1) Compose account info.
	// 2) Set expiration date.
	// 3) Complete payment.
	// 4) Enable auto renewal.
	// 5) Compose message for front-end saying thank you and when the account will expire.

}


exports.unsubscribe = function unsubscribe(subscriberData) {

	console.log('Unsubscribe invoked!');
	// 1) Retrieve subscription data.
	// 2) Disable autorenewal.
	// 3) Compose message for front-end saying when the account will def expire.

}


// Aditional:

// - Expiration reminder.
// -  


return module.exports;