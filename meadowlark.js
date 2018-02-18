const express = require('express');
const hbs = require('hbs');
const helpers = require('handlebars-helpers');
hbs.registerHelper(helpers());

const app = express();
app.use(express.static(`${__dirname}\\public`));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', { fortune: ['A', 'B', 'C'] });
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