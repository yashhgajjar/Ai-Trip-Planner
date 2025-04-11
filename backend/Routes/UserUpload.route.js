// routes/routes.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const TripExperience = require('../models/UserUpload');

const router = require('express').Router();

// Create a new S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload file to S3
const uploadToS3 = async (file) => {
  const fileKey = `trip_plans/${Date.now()}-${file.originalname}`;
  console.log(`Preparing to upload file: ${file.originalname} to S3 with key: ${fileKey}`);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
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


// POST API to save trip experience and upload images to S3
router.post('/submit-experience', upload.array('photos', 10), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { email, experience, destination, fromDate, toDate } = req.body;
    const photos = [];

    // Upload each file to S3
    for (const file of req.files) {
      console.log('Uploading file:', file.originalname); // Log file being uploaded
      const fileUrl = await uploadToS3(file);
      console.log('Uploaded file URL:', fileUrl);  // Log the URL to the console
      photos.push(fileUrl);  // Save the image URL
    }

    // Save the data in MongoDB
    const newExperience = new TripExperience({
      email,
      experience,
      destination,
      fromDate,
      toDate,
      photos,
    });

    await newExperience.save();
    res.status(200).json({ message: 'Experience saved successfully!', photos });
  } catch (err) {
    console.error('Error saving experience:', err);  // Log the error
    res.status(500).json({ message: 'Error saving experience', error: err });
  }
});

// GET API to retrieve all experiences
router.get('/experiences', async (req, res) => {
  try {
    const experiences = await TripExperience.find(); // Fetch all experiences from DB
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error });
  }
});


module.exports = router;
