const http = require('http');
const express = require('express');
const hbs = require('hbs');
const helpers = require('handlebars-helpers');
const morgan = require('morgan');
const fortune = require('./lib/fortune');
const data = require('./lib/data');
const getWeatherData = require('./lib/getWeather');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const credentials = require('./lib/credentials');
const Vacation = require('./models/vacation');
const VacationInSeasonListener = require('./models/vacationInSeasonListener');

hbs.registerHelper(helpers());
hbs.registerPartials('./views/partials');

mongoose.connect(credentials.mongo.url, {autoIndex: false}).then().catch(err => {
  console.error(err);
});

Vacation.find(function(err, vacations){
  if(vacations.length) return;
  new Vacation({
    name: 'Hood River Day Trip',
    slug: 'hood-river-day-trip',
    category: 'Day Trip',
    sku: 'HR199',
    description: 'Spend a day sailing on the Columbia and ' +
    'enjoying craft beers in Hood River!',
    priceInCents: 9995,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save();
  new Vacation({
    name: 'Oregon Coast Getaway',
    slug: 'oregon-coast-getaway',
    category: 'Weekend Getaway',
    sku: 'OC39',
    description: 'Enjoy the ocean air and quaint coastal towns!',
    priceInCents: 269995,
    tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
  }).save();
  new Vacation({
    name: 'Rock Climbing in Bend',
    slug: 'rock-climbing-in-bend',
    category: 'Adventure',
    sku: 'B99',
    description: 'Experience the thrill of climbing in the high desert.',
    priceInCents: 289995,
    tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
    inSeason: true,
    requiresWaiver: true,
    maximumGuests: 4,
    available: false,
    packagesSold: 0,
    notes: 'The tour guide is currently recovering from a skiing accident.',
  }).save();
});

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('short', {stream: accessLogStream}));
app.disable('x-powered-by');
app.use(express.static(`${__dirname}\\public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.weather = getWeatherData();
  next();
});

app.get('/', (req, res) => {
  res.render('home', data);
});

app.get('/about', (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
});

app.get('/newsletter', (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' })
});

app.post('/process', (req, res) => {
  console.log(req.query);
  console.log(req.body);
  res.redirect(303, '/thank-you');
});

app.get('/tours/hood-river', (req, res) => {
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', (req, res) => {
  res.render('tours/request-group-rate');
});

app.get('/headers', (req, res) => {
  res.set('Content-Type', 'text/plain');
  let s = '';
  for (const name in req.headers) {
    if (req.headers.hasOwnProperty(name)) {
      s += `${name} : ${req.headers[name]} \n`
    }
  }
  res.send(s);
});

app.get('/vacations', (req, res) => {
  Vacation.find({available: true}, (err, vacations) => {
    const context = {
      vacations: vacations.map(vacation => ({
        sku: vacation.sku,
        name: vacation.name,
        description: vacation.description,
        price: vacation.getDisplayPrice(),
        inSeason: vacation.inSeason
      }))
    };
    res.render('vacations', context);
  })
});

app.get('/notify-me-when-in-season', (req, res) => {
  res.render('notify-me-when-in-season', {sku: req.query.sku})
});

app.post('/notify-me-when-in-season', (req, res) => {
  VacationInSeasonListener.update(
    {email: req.body.email},
    {$push: { skus: req.body.sku }},
    {upsert: true},
    err => {
      if (err) {
        console.err(err.stack);
      }
      return res.redirect(303, '/vacations');
    }
  )
})

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500);
  res.render('500');
});

function startServer() {
  http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express started on http://localhost: ${app.get('port')}; press Ctrl-C to terminate`);
  });
}

if (require.main === module) {
  startServer();
} else {
  module.exports = startServer;
}
