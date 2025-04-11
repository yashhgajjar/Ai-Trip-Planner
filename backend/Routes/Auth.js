const express = require("express");
const crypto = require("crypto");
const User = require("../models/File");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Import email templates

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "gyash9644@gmail.com",
    pass: "eyxv mmrx ahje anqz",
  },
  tls: {
    rejectUnauthorized: false, // Ignore self-signed certificate error
  },
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("User found:", user);

    // Send Email
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 30px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  border: 1px solid #ddd;
              }
              .header {
                  background-color: #007BFF;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  font-size: 26px;
                  font-weight: bold;
              }
              .content {
                  padding: 25px;
                  line-height: 1.8;
              }
              .button {
                  display: inline-block;
                  padding: 12px 25px;
                  margin: 20px 0;
                  background-color: #007BFF;
                  text-decoration: none;
                  border-radius: 5px;
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                  transition: background-color 0.3s;
              }
              .button:hover {
                  background-color: #0056b3;
              }
              .footer {
                  background-color: #f4f4f4;
                  padding: 15px;
                  text-align: center;
                  color: #777;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Password Reset Request</div>
              <div class="content">
<p>Hello ${user.firstName || "User"},</p>
                  <p>We received a request to reset your password. You can reset it using the link below:</p>
                  <a href="${resetUrl}" class="button" style="color: white !important;">Reset Password</a>
                  <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
