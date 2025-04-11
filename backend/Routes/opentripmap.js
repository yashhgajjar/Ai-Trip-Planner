// Express Route
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const API_KEY = process.env.OPENTRIPMAP_API_KEY;
const BASE_URL = "https://api.opentripmap.com/0.1/en/places";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon, radius } = req.query; // User’s location & search radius
    const url = `${BASE_URL}/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=transport&apikey=${API_KEY}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transport options" });
  }
});
router.get("/details", async (req, res) => {
  const { xid } = req.query;
  try {
    const response = await axios.get(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place details" });
  }
});

router.get("/accommodations", async (req, res) => {
  try {
    const { bbox, types } = req.query;

    if (!bbox || !types) {
      return res
        .status(400)
        .json({ error: "Missing bbox or accommodation types" });
    }

    // Check if the bbox format is valid before sending the request to Overpass
    if (!isValidBbox(bbox)) {
      return res
        .status(400)
        .json({ error: "Invalid bounding box format. Example Format: south,west,north,east" });
    }

    const typeFilters = types
      .split(",")
      .map((type) => `[tourism=${type.replace("_", " ")}]`)
      .join("");

    const query = `[out:json][timeout:25];(node(${bbox})${typeFilters};way(${bbox})${typeFilters};relation(${bbox})${typeFilters};);out body; >; out skel qt;`;
    const encodedQuery = encodeURIComponent(query);
    const url = `${OVERPASS_URL}?data=${encodedQuery}`;

    const response = await axios.get(url);
    res.json(response.data.elements);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
});

// Function to validate bbox format
function isValidBbox(bbox) {
  // Example: validates the bbox string
  const bboxRegex = /^-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+$/;
  return bboxRegex.test(bbox);
}

module.exports = router;
