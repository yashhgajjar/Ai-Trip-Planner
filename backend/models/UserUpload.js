// models/model.js
const mongoose = require('mongoose');

// Define a Schema for trip experiences
const tripSchema = new mongoose.Schema({
  email: { type: String, required: true },
  experience: { type: String, required: true },
  destination: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  photos: [String],  // To store photo URLs or paths
});

// Create a Model for the trip experience
const TripExperience = mongoose.model('TripExperience', tripSchema);

module.exports = TripExperience;
