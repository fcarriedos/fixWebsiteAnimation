// var restify = require('restify');

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const nodemailer = require('nodemailer')
const PORT = process.env.PORT || 5000

var webapp = express();
var emailTransporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'wellidontwanttogivemyaddress@gmail.com',
		pass: 'SCHERBREMM2016.'
	}
});

var mailOptions = {
	from: 'wellidontwanttogivemyaddress@gmail.com',
	to: 'francisco@messengersell.com',
	subject: 'EARLY ACCESS',
	text: ''
};

webapp.use(bodyParser.json());
webapp.use(bodyParser.urlencoded({ extended: true }));


// Web pages
webapp
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));


// Bot endpoints
webapp.post('/instant-online-shop', (req, res) => {
	console.log("Request received: " + JSON.stringify(req.body, null, 4));
	
	if (req.body.attachments) {
		console.log("Image received: " + req.body.attachments[0].contentUrl + " from user " + req.body.from.id);
		processImage(req);

	} else {
		console.log("NOT image received");
	}
	res.sendStatus(200);
});


// Send email to waiting list
webapp.get('/waitinglist', (req, res) => {
	mailOptions.text = JSON.stringify(req.query.waitingListEmail, null, 4);
	console.log("Sending " + req.query.waitingListEmail + " to waiting list.");
	emailTransporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			console.log("Error sending mail " + req.query.waitingListEmail + " to the waiting list");
			console.log(err);
		} else {
			console.log("Email " + req.query.waitingListEmail + " successfully sent to the waiting list");
		}
	});
	res.sendStatus(200);
});

function processImage(req) {
	imageURL = req.body.attachments[0].contentUrl;
	userId = req.body.from.id;
	fs.appendFile(userId, imageURL + '\n', function(err) {
		if(err) {
			console.log('Could not save the URL ' + imageURL + ' to file ' + userId);
			throw err;
		}
		console.log('Saved URL ' + imageURL + ' to file ' + userId);
		fs.readFile(userId, function(err, data) {
			console.log("Contents of the file:");
			console.log(data.toString('UTF-8'));
		});
	});
}


// Webhook verification
webapp.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "37mej3wg9JR3bhAcE40e8fd9D4Es384P8GkEHFpW3S92yU"
    
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

// And starting!
webapp.listen(PORT, () => console.log(`Listening on ${ PORT }`));