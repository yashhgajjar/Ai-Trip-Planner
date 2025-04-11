import React, { useState, useEffect } from "react";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import im14 from "../assets/im14.jpg";
import axios from "axios";

const UserUpload = () => {
  const [experience, setExperience] = useState("");
  const [destination, setDestination] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Retrieve email from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setEmail(user.email); // Set email from user data
    }
  }, []);

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("experience", experience);
    formData.append("destination", destination);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);

    // Append files to FormData
    Array.from(photos).forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/submit-experience`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // If the submission is successful, redirect to the home page
      if (response.status === 200) {
        console.log("Experience submitted successfully:", response.data);
        window.location.href = "/shareExp"; // Redirect to home page
      }
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        buttons={
          isLoggedIn
            ? [{ label: "History", path: "/tripHistory" }]
            : [{ label: "History", path: "/tripHistory" }]
        }
      />

      <div
        className="flex-grow p-8 bg-gray-50 pt-20 pb-20"
        style={{
          backgroundImage: `url(${im14})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex-grow p-8 bg-transparent-50  pb-20 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.30)", // Light semi-transparent white
            // backdropFilter: 'blur(10px)', // Add blur effect
          }}
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Share Your Trip Experience
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Destination */}
            <div className="form-group">
              <label
                htmlFor="destination"
                className="block text-lg font-medium text-gray-800"
              >
                Destination:
              </label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Enter your destination"
                className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Trip Dates - From and To Date */}
            <div className="form-group grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fromDate"
                  className="block text-lg font-medium text-gray-800"
                >
                  From Date:
                </label>
                <input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="toDate"
                  className="block text-lg font-medium text-gray-800"
                >
                  To Date:
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={handleToDateChange}
                  className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Trip Experience */}
            <div className="form-group">
              <label
                htmlFor="experience"
                className="block text-lg font-medium text-gray-800"
              >
                Write your experience:
              </label>
              <textarea
                id="experience"
                value={experience}
                onChange={handleExperienceChange}
                placeholder="Tell us about your trip..."
                required
                className="w-full h-32 p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Upload Photos */}
            <div className="form-group">
              <label
                htmlFor="photos"
                className="block text-lg font-medium text-gray-800"
              >
                Upload Photos:
              </label>
              <input
                type="file"
                id="photos"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="col-span-1 sm:col-span-2 w-full py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Submit Experience
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserUpload;
