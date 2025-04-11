const express = require("express");
const Trip = require("../models/tripPlan");
const PdfGen = require("../models/tripModel"); // Ensure this model stores PDFs


const router = express.Router();

// Save Trip Data
router.post("/save-trip", async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    await newTrip.save();

    res.status(201).json({ tripId: newTrip._id, message: "Trip saved successfully" }); // Fix: return tripId
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ error: "Failed to save trip" });
  }
});


// Fetch Trip Data for a specific user by userId
router.get("/get-trips", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.find({ userId: userId });

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found for this user" });
    }

    res.json(trips); // Send the trips data for the specific userId
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

router.get("/get-trip-pdfs", async (req, res) => {
  try {
    const { userId, tripId } = req.query;

    if (!userId || !tripId) {
      return res.status(400).json({ error: "User ID and Trip ID are required" });
    }

    // Find PDFs where both userId and tripId match
    const pdfs = await PdfGen.find({ userId, tripId });

    if (!pdfs.length) {
      return res.status(404).json({ message: "No PDFs found for this trip" });
    }

    res.status(200).json(pdfs); // Send matching PDF URLs
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});


module.exports = router;
