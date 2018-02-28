const data = require('../lib/data');

module.exports = (req, res) => {
  res.render('home', data)
};
