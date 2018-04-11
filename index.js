// var restify = require('restify');

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var webapp = express();

// Web pages
webapp
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));

// Bot endpoints
webapp.post('/instant-online-shop', (req, res) => res.render('pages/index'));

// And starting!
webapp.listen(PORT, () => console.log(`Listening on ${ PORT }`));