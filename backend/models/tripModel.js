const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  tripId: { type: String, required: true },
});

module.exports = mongoose.model("PdfGen", tripSchema);
