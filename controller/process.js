module.exports = (req, res) => {
  console.log(req.query);
  console.log(req.body);
  res.redirect(303, '/thank-you');
};
