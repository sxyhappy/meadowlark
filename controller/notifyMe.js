const VacationInSeasonListener = require('../models/vacationInSeasonListener');

exports.getNotifyMe = (req, res) => {
  res.render('notify-me-when-in-season', {sku: req.query.sku});
};

exports.postNotifyMe = (req, res) => {
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
};
