require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/File");
const path = require("path");
const AuthRoutes = require("./Routes/Auth.routes.js");  
const TripExperience = require("./Routes/UserUpload.route.js")
const opentripmapRoutes = require("./Routes/opentripmap.js");
const ForgotPassword = require("./Routes/Auth.js");
const tripRoutes = require("./Routes/Trip");
const PdfTrip = require("./Routes/PdfRoutes.js");

const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};


app.use(cors(corsOptions)); // Apply CORS before routes
app.use(bodyParser.json());
app.use(express.json());

app.options("*", cors(corsOptions));

app.use('/auth', AuthRoutes);
app.use('/api', TripExperience);
app.use("/api/opentripmap", opentripmapRoutes);
app.use("/auth", ForgotPassword);
app.use("/api",PdfTrip);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));


// ---------------------------
// User File Upload Routes
// ---------------------------
const bcrypt = require("bcryptjs"); // Add this at the top of the file

app.post("/upload", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,  // Save the hashed password
    });

    await newUser.save();
    res.status(200).json({
      message: "User added successfully",
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({
      message: "Failed to process the request",
      error: err.message || err.stack,
    });
  }
});


// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// ---------------------------
// Trip Plan Routes
// ---------------------------

app.use("/api/trips", tripRoutes);


// ---------------------------
// Authentication Route
// ---------------------------

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ---------------------------
// Static File Serving
// ---------------------------
app.use("/uploads", express.static("uploads"));

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});


// ---------------------------
// Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
