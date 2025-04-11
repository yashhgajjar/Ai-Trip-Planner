import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        { email, password }
      );

      if (response.status === 200) {
        const { user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login successful!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(
        "Error: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <div>
      <Header
        buttons={
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
        }
      />
      <div className="flex-grow p-8 pt-5 mt-3">
        <div
          className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6"
          style={{
            boxShadow:
              "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login to Your Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2"
          >
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div
                    onClick={() => navigate("/signup")}
                    className="font-bold text-gray-700 cursor-pointer"
                  >
                    New here? Create an account!{" "}
                  </div>

            <button
              type="submit"
              className="col-span-1 sm:col-span-2 w-full py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>

            {/* Forgot Password Link */}
            <p
              className="col-span-1 sm:col-span-2 text-center text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
