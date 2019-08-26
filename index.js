// var restify = require('restify');
const CONSTANTS = require('./CONSTANTS.js');
const responseUtils = require('./responseUtils.js');
const subscriptions = require('./subscriptions.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const encryptionUtility = require('./encryptionUtility.js');
const sendgridMailer = require('./sendgridMailer.js');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const dbclient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;

getDBPool();

var webapp = express();
// var forceSSL = require('express-force-ssl');

webapp.use(bodyParser.json());
webapp.use(bodyParser.urlencoded({ extended: true }));
// webapp.use(forceSSL);


// Web pages
webapp
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');
  // .get('/', (req, res) => res.render('pages/index'));


// Process referrals
webapp.get('/r/:token', (req, res) => {
	console.log('index.get(/r): servicing referral request from user with token ' + req.params.token);

	dbclient.connect(CONSTANTS.MONGODB_URL, function(dbConnectionErr, db) {
        if (dbConnectionErr) { // Crash connecting to the database 
        	console.log('index.get(/r): could not connect to the database to service referral with token ' + req.params.token + ' due to ' + dbConnectionErr);
        	throw new Error('index.get(/r): internal server error.');
        } else {
	        var dbo = db.db(CONSTANTS.WEBSITE_DATABASE_NAME);
	        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOne({ referral_hash: req.params.token }, function(err, result) {
	        	if (err) { // Crash finding the email in the database
	        		console.log('index.get(/r): error finding email ' + email);
	        		throw err;
	        	} else {				       
		        	if (result == null) {
		        		return res.status(401).json({ code: 401, messages: ['unexisting referral token'] });
		        	} else {
		        		console.log('index.get(/r): redirecting referral with user id ' + result['_id']);
		        		var userDatastructure = JSON.stringify(sendgridMailer.getUserDatastructure(result['_id']));
		        		res.writeHead(302, {
					      'Location': '/referral.html?referer_token=' + encryptionUtility.cypher(userDatastructure)
					      //add other headers here...
					    });
					    res.end();
		        	}
		        }
	        	db.close();
	        });
    	}
    });
});


// Send email to waiting list
webapp.post('/api/lead', 
	// Validators
	[

	check('email').isEmail().withMessage('Is not a valid email.'),
	check('name').exists().custom((value) => value.length > 0).withMessage('The name is empty')

	],
	// Request processing
	(req, res) => {

		errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ code: 422, messages: errors.mapped() });
		} else {

			var email = req.body.email;
			var name = req.body.name;
			console.log('Received referer token: ' + req.body.referer_token);
			// JSON parsing twice because of escaped quotes.
			var refererDatastructure = JSON.parse(JSON.parse((encryptionUtility.decypher(req.body.referer_token))));
			var refererId = (refererDatastructure == null) ? null : refererDatastructure.id;
			console.log('index.post(/api/lead): lead refered by user ' + refererId);
			// DB checking
			dbclient.connect(CONSTANTS.MONGODB_URL, function(dbConnectionErr, db) {
		        if (dbConnectionErr) { // Crash connecting to the database 
		        	console.log('index.post(/api/lead): could not connect to the database to validate ' + email + ' due to ' + dbConnectionErr);
		        	throw new Error('index.post(/api/lead): internal server error.');
		        } else {
			        var dbo = db.db(CONSTANTS.WEBSITE_DATABASE_NAME);
			        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOne({ email: email }, function(err, result) {
			        	if (err) { // Crash finding the email in the database
			        		console.log('index.post(/api/lead): error finding email ' + email);
			        		throw err;
			        	} else {				       
				        	if (result != null) {
				        		return res.status(409).json({ code: 409, messages: ['email already exists'] });
				        	} else {
				        		sendgridMailer.sendWaitingListEmail(name, email, refererId, null, null, res);
				        	}
				        }
			        	db.close();
			        });
		    	}
		    });
		}
	}
);

// Send email to waiting list
webapp.post('/api/lead/bot', 
	// Validators
	[

	check('user email').isEmail().withMessage('Email is invalid'),
	check('first name').exists().custom((value) => (value != null) && (value.length > 0)).withMessage('The first name is empty'),
	check('last name').exists().custom((value) => (value != null) && (value.length > 0)).withMessage('The last name is empty'),
	check('chatfuel user id').exists().custom((value) => (value != null) && (value.length > 0)).withMessage('Chatfuel id cannot be empty'),
	check('messenger user id').exists().custom((value) => (value != null) && (value.length > 0)).withMessage('Messenger id cannot be empty')

	],
	// Request processing
	(req, res) => {
		res.setHeader('botresponsetype', true); // To provide Chatfuel bot formated response 
		console.log(JSON.stringify(req.body, null, 2));
		errors = validationResult(req);

		if (!errors.isEmpty()) {
			// Treat errors pointing to blocks.
			console.log('index.post(/api/lead/bot): errors validating input parameters ' + JSON.stringify(errors, null, 2));
			responseUtils.sendResultResponse(422, 422, errors.mapped(), null, res);// res.status(422).json({ code: 422, messages: errors.mapped() });
		} else {

			var email = req.body['user email'];
			var name = req.body['first name'] + ' ' + req.body['last name'];
			var cfid = req.body['chatfuel user id'];
			var psid = req.body['messenger user id'];
			
			// DB checking
			var dbo = CONSTANTS.DB.db(CONSTANTS.DATABASE_NAME);

	        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOne({ email: email })
	        .then(findUserResult => {	       
	        	if (findUserResult != null) {
	        		console.log('index.post(/api/lead/bot): user ' + email + ' already exits');
	        		var errorMessage = { "user email" : { msg: "The email already exists" } }; // For Chatfuel this is the format for messages
	        		responseUtils.sendResultResponse(409, 409, errorMessage, null, res); //return res.status(409).json({ code: 409, messages: ['email already exists'] });
	        	} else {
	        		console.log('index.post(/api/lead/bot): including user ' + email + ' (' + name + ') in the wait list.');
	        		sendgridMailer.sendWaitingListEmail(name, email, null, cfid, psid, res);
	        	}
	        })
	        .catch(findUserError => {
	    		console.log('index.post(/api/lead/bot): error finding email ' + email);
	    		throw findUserError;
	    		// send to block
	        });
		}
	}
);


webapp.get('/api/lead/confirm',
	// Validators
	[

	check('token').exists().custom((value) => value.length > 0).withMessage('The token cannot be empty')

	],
	(req, res) => {

	dbclient.connect(CONSTANTS.MONGODB_URL, function(dbConnectionErr, db) {
        if (dbConnectionErr) { // Crash connecting to the database 
        	console.log('index.get(/api/lead/confirm): could not connect to the database to confirm with token ' + token + ' due to ' + dbConnectionErr);
        	throw new Error('index.get(/api/lead/confirm): internal server error.');
        } else {
	        var dbo = db.db(CONSTANTS.WEBSITE_DATABASE_NAME);
	        dbo.collection(CONSTANTS.SENT_EMAILS_TABLE).findOne({ confirmation_hash: req.query.token }, function(err, result) {
	        	if (err) { // Crash finding the email in the database
	        		console.log('index.get(/api/lead/confirm): error finding email ' + email);
	        		throw err;
	        	} else {
		        	if (result == null) {
		        		return res.status(401).json({ code: 401, messages: ['token does not exist'] });
		        	} else {
						console.log('index.get(/api/lead/confirm): servicing confirmation request for ' + result.email);
						sendgridMailer.confirmEmail(result.email, res);
		        	}
		        }
	        	db.close();
	        });
    	}
    });
});


webapp.post('/api/contact', 
	// Validators
	[

	check('contactemail').isEmail().withMessage('Is not a valid email.'),
	check('name').exists().custom((value) => value.length > 0).withMessage('The name is empty.'),
	check('message').escape()

	],
	// Request processing
	(req, res) => {

		errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ code: 422, messages: errors.mapped() });
		} else {
			var contactemail = req.body.contactemail;
			var name = req.body.name;
			var message = req.body.message;
			console.log('index.post(/api/contact): servicing contact request with name ' + name + ' (' + contactemail + '), saying: ' + message);
			sendgridMailer.sendContactEmail(name, contactemail, message, res);
		}
	}
);


// Creates the endpoint for our webhook 
webapp.post('/webhook', (req, res) => {  
 
  let body = req.body;

  console.log('Request received: ' + JSON.stringify(body, null, 2));

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    // Returns a '200 OK' response to all requests
  	res.status(200).send('EVENT_RECEIVED');

  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
webapp.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "cacadelavaca"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});


// Adds support for GET requests to our webhook
webapp.get('/privacyAndTerms', (req, res) => {
    res.status(200).send();
});


webapp.get('/.well-known/acme-challenge/QaFQvY2oakMh3-bhP1F3XOL1-iNy1oCwR8VULWFclcQ', (req, res) => {
	var contents = 'QaFQvY2oakMh3-bhP1F3XOL1-iNy1oCwR8VULWFclcQ.M_wNT8lKySZW-DN9uhVuijy2OZZ36FQNlqvgPoN_M3I';
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=challenge.txt');
    res.setHeader('Content-Length', contents.length);
  //   'Content-Type': 'text/plain',
  // 'Content-Disposition': 'attachment; filename=some_file.pdf',
  // 'Content-Length': data.length
    res.send(contents);
});


webapp.post('/subscribe/', (req, res) => {
	
	if (req.body.action == 'subscribe') {
		subscriptions.subscribe();
		res.send();
		return;
	}

	if (req.body.action == 'unsubscribe') {
		subscriptions.unsubscribe();
		res.send();
		return;
	}

	// Respond with an error
	res.send();
	return;

});


webapp.get('/pricing/stripe/js/index.js', (req, res) => {

	console.log('/pricing/stripe/js/index.js: servicing Stripe script with params DASHBOARD_ENDPOINT ' + CONSTANTS.DASHBOARD_ENDPOINT + ' and Stripe PK key ' + CONSTANTS.STRIPE_PUBLISHABLE_KEY);
	res.render('pages/pricing/stripe/js/index.ejs', {
		DASHBOARD_ENDPOINT: CONSTANTS.DASHBOARD_ENDPOINT,
		STRIPE_PUBLISHABLE_KEY: CONSTANTS.STRIPE_PUBLISHABLE_KEY
	});

});


webapp.get('/pricing/:provider', (req, res) => {

	var ipAddress = getClientIPAddress(req);
	console.log('/pricing/: servicing request for provider ' + req.params.provider + ' from client address ' + ipAddress);
	res.render('pages/pricing/' + req.params.provider + '/index.ejs', {
		ipAddress: ipAddress,
		paypalClientId: process.env.PAYPAL_SUBSCRIPTION_CLIENT_ID,
		paypalPlans: process.env.PAYPAL_PLANS,
		DASHBOARD_ENDPOINT: CONSTANTS.DASHBOARD_ENDPOINT
	});

});


webapp.get('/libs/validation/pricingFormValidation.js', (req, res) => {

	console.log('/libs/validation/: servicing form validation script');
	res.render('pages/libs/validation/pricingFormValidation.ejs', {
		DASHBOARD_ENDPOINT: CONSTANTS.DASHBOARD_ENDPOINT,
		PLATFORM_ENDPOINT: CONSTANTS.PLATFORM_ENDPOINT
	});

});


webapp.get('/js/script.js', (req, res) => {

	console.log('/js/script.js: servicing general purpose script');
	res.render('pages/js/script.ejs', {
		DASHBOARD_ENDPOINT: CONSTANTS.DASHBOARD_ENDPOINT,
		WEBSITE_URL_ENDPOINT: CONSTANTS.WEBSITE_URL_ENDPOINT
	});

});


webapp.get('/caca', (req, res) => {

	console.log('/caca: TESTING REMOTE ADDRESS ');
	getClientIPAddress(req);
	res.send();

});


function getClientIPAddress(req) {
  var ipAddr = req.headers["x-forwarded-for"];
  console.log('Headers: ' + JSON.stringify(req.headers, null, 2));
  console.log('x-forwarded-for: ' + ipAddr);
  if (ipAddr){
    var list = ipAddr.split(",");
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }
  return ipAddr;
}


function getDBPool() {
	dbclient.connect(CONSTANTS.MONGODB_URL, function(err, db) {
		if(!err) {
			CONSTANTS.DB = db;
			console.log('app.getDBPool(): database initialized.');
		} else {
			console.log('app.getDBPool(FATAL): could not connect with the database.');
		}
	});
}


// And starting!
webapp.listen(PORT, () => console.log(`Listening on ${ PORT }`));