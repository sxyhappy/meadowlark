const Vacation = require('../models/vacation');

module.exports = (req, res) => {
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
};
