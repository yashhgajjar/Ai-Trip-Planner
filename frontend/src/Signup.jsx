import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";
import { toast } from "react-toastify";

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full"></div>
  </div>
);

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user1");
    setIsLoggedIn(!!user);

    // Restore data from local storage if available
    const storedEmail = localStorage.getItem("email");
    const storedStep = localStorage.getItem("step");

    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedStep) {
      setStep(parseInt(storedStep, 10));
    } else {
      setStep(1); // Default step if not found in local storage
    }

    const stepStatus = localStorage.getItem("stepCompleted");
    if (stepStatus === "1") {
      setStep(2);

      return () => {
        localStorage.removeItem("stepCompleted");
      };
    }
  }, []);


  
  useEffect(() => {
    // Update local storage when email or step changes
    localStorage.setItem("email", email);
    localStorage.setItem("step", step.toString());
  }, [email, step]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !password) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const userResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      console.log("User registration response:", userResponse);

      if (userResponse.status === 200) {
        console.log("User added successfully");
        localStorage.removeItem("stepCompleted");
        localStorage.removeItem("email");
        localStorage.removeItem("step");
        navigate("/login");
      } else {
        console.log("User registration failed:", userResponse);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert(
        "Error: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const registerUser = async (userData) => {
    try {
      console.log("Sending registration request with:", userData);
      return await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        userData
      );
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const verifyEmail = async (code) => {
    try {
      console.log("Verifying email with code:", code);
      return await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/verifyEmail`,
        { code }
      );
    } catch (error) {
      console.error("Error during email verification:", error);
      throw error;
    }
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      alert("Please enter your email first.");
      return;
    }
    console.log("Sending OTP for email:", email);
    setLoading(true);
    try {
      const res = await registerUser({ email });
      console.log("OTP Sent Response:", res);
      toast.success(res.data.message + " Check Your Email");
      setOtpSent(true);
      setLoading(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Registration Failed");
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    console.log("Verifying OTP:", otp);
    try {
      const res = await verifyEmail(otp);
      console.log("OTP Verification Response:", res);
      toast.success(res.data.message);
      setVerificationSuccess(true);
      setStep(2);
      localStorage.setItem("stepCompleted", "1");
      localStorage.setItem("email", email); // Store email in local storage
      localStorage.setItem("step", "2"); // Store step in local storage
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Verification Failed");
    }
  };

  const formRef = React.createRef();
  const check = (values) => {
    if (localStorage.getItem("email") === values.email) {
      window.location = "/login";
      return true;
    } else {
      window.location = "/login";
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
          className="max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg p-6"
          style={{
            boxShadow:
              "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                Email OTP Verification
              </h2>
              {loading ? (
                <Spinner />
              ) : (
                <form className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Enter Your Email
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div
                    onClick={() => navigate("/login")}
                    className="font-bold text-gray-700 cursor-pointer"
                  >
                    Already have an account?{" "}
                  </div>

                  {otpSent && (
                    <>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          OTP
                        </label>
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-4">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOtp}
                        className="w-full py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                      >
                        Send OTP
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="w-full py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                      >
                        Verify OTP
                      </button>
                    )}
                  </div>

                  {verificationSuccess && (
                    <p className="text-blue-400 text-center mt-4">
                      OTP Verified Successfully!
                    </p>
                  )}
                </form>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
                Register User
              </h1>
              <form
                onSubmit={handleSubmit}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2"
                ref={formRef}
              >
                {/* First Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    disabled
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

                <button
                  onClick={() => {
                    const formValues = { email };
                    check(formValues);
                  }}
                  type="submit"
                  className="col-span-1 sm:col-span-2 w-full py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
