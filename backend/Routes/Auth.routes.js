const express = require('express');
const { sendVerificationEamil, senWelcomeEmail } = require('../middlewares/Email');
const { Usermodel } = require('../models/User');
const bcryptjs = require('bcryptjs');

const router = express.Router();

// Register User (Only Email)
router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Ensure email is provided
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Check if the user already exists
        const ExistsUser = await Usermodel.findOne({ email });
        if (ExistsUser) {
            return res.status(400).json({ success: false, message: "User Already Exists Please Login" });
        }

        // Generate a random verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user object with only email and verification token
        const user = new Usermodel({
            email,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
        });

        // Save the user in the database
        await user.save();

        // Send the verification email with the generated token
        await sendVerificationEamil(user.email, verificationToken);

        return res.status(200).json({ success: true, message: "User Registered Successfully. Check your email for verification." });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(400).json({ success: false, message: "Internal server error" });
    }
});

// Verify User Email (Only Email and Verification Token)
router.post('/verifyEmail', async (req, res) => {
    try {
        const { code } = req.body;

        // Ensure verification code is provided
        if (!code) {
            return res.status(400).json({ success: false, message: "Verification code is required" });
        }

        // Find the user with the provided verification code
        const user = await Usermodel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }, // Ensure the token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Expired Code" });
        }

        // Mark the user as verified and remove the token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        // Save the updated user information
        await user.save();

        // Send a welcome email after successful verification
        await senWelcomeEmail(user.email);

        return res.status(200).json({ success: true, message: "Email Verified Successfully" });
    } catch (error) {
        console.error("Error during email verification:", error);
        return res.status(400).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
