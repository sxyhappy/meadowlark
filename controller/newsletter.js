module.exports = (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' })
};
