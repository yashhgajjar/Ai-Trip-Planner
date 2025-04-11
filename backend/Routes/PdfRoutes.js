const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const express = require("express");
const multer = require("multer");
const Trip = require("../models/tripModel");

const router = express.Router();

// Initialize S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

console.log("AWS S3 Client initialized successfully.");

// Multer Configuration for Memory Storage
const upload = multer({ storage: multer.memoryStorage() });
console.log("Multer configured for memory storage.");

// Function to Upload PDF to S3
const uploadToS3 = async (file) => {
    const fileKey = `trip_plans/${Date.now()}-${file.originalname}`;
    console.log(`Preparing to upload file: ${file.originalname} to S3 with key: ${fileKey}`);
  
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: "application/pdf",  
    };
  
    try {
      console.log("Sending file upload request to S3...");
      const command = new PutObjectCommand(params);
      await s3.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      console.log(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading PDF to S3:", error);
      throw new Error("Error uploading PDF to S3: " + error.message);
    }
  };
  
// Route to Upload PDF & Save URL in MongoDB
router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    console.log("Received request to /upload-pdf");
    try {
      const { userId, tripId } = req.body;
      console.log(`User ID: ${userId}, Trip ID: ${tripId}`);
  
      if (!req.file) {
        console.error("No file uploaded.");
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      console.log(`Uploading file: ${req.file.originalname} to S3...`);
      const pdfUrl = await uploadToS3(req.file);
  
      console.log(`Saving PDF URL in MongoDB for tripId: ${tripId}`);
      const newTrip = new Trip({ userId, tripId, pdfUrl });
      await newTrip.save();
  
      console.log(`PDF successfully stored in MongoDB: ${pdfUrl}`);
      res.status(200).json({ message: "PDF uploaded successfully!", pdfUrl });
    } catch (error) {
      console.error("AWS S3 Upload Error:", error);
      res.status(500).json({ error: "Failed to upload PDF", details: error.message });
    }
  });
  
  
console.log("Upload route /upload-pdf is now ready.");

module.exports = router;
