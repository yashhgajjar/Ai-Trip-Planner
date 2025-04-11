import React, { useState,useEffect } from "react";
import axios from "axios";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);


   useEffect(() => {
      // Check if user data exists in localStorage
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user); // Set to true if user data exists
    }, []);
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        "Error: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header  buttons={
          isLoggedIn
            ? [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
            : [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
        } />
      <div className="flex-grow flex justify-center items-center mt-5 mb-4">
        <div className="w-96 p-6 bg-gray-100 shadow-md rounded-md">
          <h1 className="text-xl font-bold mb-4 text-center">
            Reset Password
          </h1>
          <form onSubmit={handleForgotPassword}>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send Reset Link
            </button>
          </form>
          {message && <p className="text-center mt-3">{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
