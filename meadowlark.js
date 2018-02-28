const http = require('http');
const express = require('express');
const hbs = require('hbs');
const helpers = require('handlebars-helpers');
const morgan = require('morgan');
const getWeatherData = require('./lib/getWeather');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const credentials = require('./lib/credentials');
const router = require('./router');

hbs.registerHelper(helpers());
hbs.registerPartials('./views/partials');

mongoose.connect(credentials.mongo.url, {autoIndex: false}).then().catch(err => {
  console.error(err);
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

router(app);

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
