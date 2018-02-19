const express = require('express');
const hbs = require('hbs');
const helpers = require('handlebars-helpers');
const fortune = require('./lib/fortune');
hbs.registerHelper(helpers());

const app = express();
app.use(express.static(`${__dirname}\\public`));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use((req, res, next) => {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
});

app.get('/tours/hood-river', (req, res) => {
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', (req, res) => {
  res.render('tours/request-group-rate');
});

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log(`Express started on http://localhost: ${app.get('port')}; press Ctrl-C to terminate`);
});
