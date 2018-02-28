const fortune = require('../lib/fortune');

module.exports = (req, res) => {
  res.render('about', { fortune: fortune.getFortune() });
};
