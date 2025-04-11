import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset token.");
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/reset-password/${token}`,
        { newPassword, confirmPassword }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login"); // Redirect after successful password reset
      }, 3000);
    } catch (error) {
      console.error("Axios Error:", error); // Log full error object for more details
      setMessage("Error: " + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <div className="w-96 p-6 bg-gray-100 shadow-md rounded-md mt-5 mb-4">
          <h1 className="text-xl font-bold mb-4 text-center">Reset Password</h1>
          <form onSubmit={handleResetPassword}>
            <label className="block text-gray-700 font-medium mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <label className="block text-gray-700 font-medium mb-2 mt-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button type="submit" className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Reset Password
            </button>
          </form>
          {message && <p className="text-center mt-3">{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
