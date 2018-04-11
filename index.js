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
	console.log("Request received: " + JSON.stringify(req.body));
	res.sendStatus(200);
});

// And starting!
webapp.listen(PORT, () => console.log(`Listening on ${ PORT }`));