const mongoose = require('mongoose');

const vacationInSeasonListenerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});

const vacationInSeasonListener = mongoose.model('VacationInSeasonListener', vacationInSeasonListenerSchema);

module.exports = vacationInSeasonListener;
