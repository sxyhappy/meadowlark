const notifyMe = require('./controller/notifyMe');

module.exports = app => {
  app.get('/', require('./controller/home'));
  app.get('/about', require('./controller/about'));
  app.get('/newsletter', require('./controller/newsletter'));

  app.post('/process', require('./controller/process'));
  app.get('/tours/hood-river', require('./controller/hoodRiver'));
  app.get('/tours/request-group-rate', require('./controller/requsetGroupRate'));
  app.get('/headers', require('./controller/headers'));
  app.get('/vacations', require('./controller/vacations'));
  app.get('/notify-me-when-in-season', notifyMe.getNotifyMe);
  app.post('/notify-me-when-in-season', notifyMe.postNotifyMe)


  app.use((req, res) => {
    res.status(404);
    res.render('404');
  });

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500);
    res.render('500');
  });
};
