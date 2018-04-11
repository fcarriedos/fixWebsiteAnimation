// var restify = require('restify');

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

var webapp = express();

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
	// res.render('pages/index');
	console.log("Request received: " + JSON.stringify(req.body, null, 4));
	res.sendStatus(200);
});


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