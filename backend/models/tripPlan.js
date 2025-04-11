const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: String,
  startDate: String,
  endDate: String,
  destinations: [String],
  tripStartPlace: [String],
  budget: [String],
  accommodation: String,
  transportation: String,
  weather: String,
  preferences: {
    adventure: Boolean,
    relaxation: Boolean,
    culture: Boolean,
    nature: Boolean,
  },
  companions: String,
  additionalNotes: String,
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
