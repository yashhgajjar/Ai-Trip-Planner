import React, { useState } from "react";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";
import { useNavigate } from "react-router-dom";
import im11 from "./assets/im11.jpg";
import DestinationInput from "./header-footer/DestinationInput";
import TripStartPlaceInput from "./header-footer/TripStartPlaceInput ";
const TripPlan = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [formData, setFormData] = useState({
    id: user.id || "",
    startDate: "",
    endDate: "",
    destinations: [""],
    tripStartPlace: [""],
    budget: [""],
    accommodation: "",
    transportation: "",
    weather: "",
    preferences: {
      adventure: false,
      relaxation: false,
      culture: false,
      nature: false,
    },
    companions: "",
    additionalNotes: "",
  });

  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const {
      startDate,
      endDate,
      destinations,
      budget,
      tripStartPlace,
      accommodation,
      transportation,
      weather,
      companions,
      additionalNotes,
      preferences,
    } = formData;
    if (startDate || endDate) {
      alert("Please fill out all the fields.");
      return false;
    }
    if (
      !destinations ||
      !tripStartPlace ||
      !budget ||
      !accommodation ||
      !transportation ||
      !weather ||
      !companions ||
      !additionalNotes ||
      !preferences
    ) {
      alert("Please fill out all the fields.");
      return false;
    }
    if (new Date(startDate) < new Date(currentDate)) {
      alert("Start date cannot be in the past.");
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be earlier than start date.");
      return false;
    }
    return true;
  };

  const handleDestinationChange = (index, value) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = value;
    setFormData({ ...formData, destinations: updatedDestinations });
  };

  const addDestination = () => {
    setFormData({ ...formData, destinations: [...formData.destinations, ""] });
  };

  const removeDestination = (index) => {
    const updatedDestinations = formData.destinations.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, destinations: updatedDestinations });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: checked,
      },
    });
  };

  // Handle previous step
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleLast = () => {
    navigate("/tripData", { state: { formData } });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null; // Ensure userId is not null
  
    console.log("Submitting trip for user:", userId);
  
    const tripData = { ...formData, userId };
  
    try {
      const response = await fetch("http://localhost:5000/api/trips/save-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save trip.");
      }
  
      const data = await response.json(); // Parse JSON response
  
      if (!data.tripId) {
        throw new Error("Trip ID not returned from API.");
      }
  
      console.log("Trip saved successfully with ID:", data.tripId);
      localStorage.setItem("trip", JSON.stringify(data.tripId));
  
      alert("Trip saved successfully!");
      navigate("/tripData", { state: { formData } });
  
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the trip.");
    }
  };
  

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        buttons={
          isLoggedIn
            ? [
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
            : [
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
        }
      />
      <div
        className="flex-grow p-8 bg-gray-50 pt-20 pb-20"
        style={{
          backgroundImage: `url(${im11})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex-grow p-8 bg-transparent-50 pt-20 pb-20 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.30)", // Light semi-transparent white
            // backdropFilter: 'blur(10px)', // Add blur effect
          }}
        >
          <div className="w-full flex flex-col items-center mb-6">
            {/* Progress Bar Container */}
            <div className="w-full h-2 bg-gray-300 rounded-full flex items-center">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* Step Indicator */}
            <div className="text-center mt-3">
              <span className="text-lg text-gray-900">{`Step ${step} of 5`}</span>
            </div>
          </div>

          {/* <div className="max-w-6xl mx-auto bg-white/40 shadow-lg rounded-lg p-6 pt-5 mt-5"> */}
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Plan Your Trip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 2 && (
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Trip Dates
                </label>
                <div className="flex space-x-4">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-1/2 p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                    min={currentDate}
                  />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-1/2 p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                    min={formData.startDate}
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <label className="block text-gray-900 font-medium mb-2">
                  Destinations
                </label>
                <DestinationInput
                  formData={formData}
                  setFormData={setFormData}
                />
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={addDestination}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label
                  htmlFor="budget"
                  className="block text-gray-900 font-medium mb-2"
                >
                  Budget (in INR)
                </label>
                {formData.budget.map((budget, index) => (
                  <input
                    key={index}
                    type="text"
                    value={budget}
                    onChange={(e) => {
                      const updatedBudget = [...formData.budget];
                      updatedBudget[index] = e.target.value;
                      setFormData({
                        ...formData,
                        budget: updatedBudget,
                      });
                    }}
                    className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Add your budget"
                  />
                ))}

                <label
                  htmlFor="tripStartPlace"
                  className="block text-gray-900 font-medium mb-2 mt-3"
                >
                  Trip Start Place
                </label>

                <TripStartPlaceInput
                  formData={formData}
                  setFormData={setFormData}
                />

                <div>
                  <label
                    htmlFor="accommodation"
                    className="block text-gray-900 font-medium mb-2 mt-3"
                  >
                    Accommodation Type
                  </label>
                  <select
                    id="accommodation"
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Accommodation Type</option>
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="resort">Resort</option>
                    <option value="camping">Camping</option>
                    <option value="bnb">Bed & Breakfast</option>
                  </select>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="">
                <div>
                  <label
                    htmlFor="transportation"
                    className="block text-gray-900 font-medium mb-2"
                  >
                    Preferred Transportation Mode
                  </label>
                  <select
                    id="transportation"
                    name="transportation"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Transportation Mode</option>
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="weather"
                    className="block text-gray-900 font-medium mb-2 mt-3"
                  >
                    Preferred Weather
                  </label>
                  <select
                    id="weather"
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Weather</option>
                    <option value="sunny">Sunny</option>
                    <option value="rainy">Rainy</option>
                    <option value="cold">Cold</option>
                    <option value="moderate">Moderate</option>
                  </select>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                {/* Preferences */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Preferences
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(formData.preferences).map(
                      ([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            name={key}
                            checked={value}
                            onChange={handleCheckboxChange}
                            className="text-blue-500 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="capitalize">{key}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Travel Companions */}
                <div>
                  <label
                    htmlFor="companions"
                    className="block text-gray-900 font-medium mb-2 mt-3"
                  >
                    Traveling With
                  </label>
                  <select
                    id="companions"
                    name="companions"
                    value={formData.companions}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Companion Type</option>
                    <option value="solo">Solo</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="partner">Partner</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label
                    htmlFor="additionalNotes"
                    className="block text-gray-900 font-medium mb-2 mt-3"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any additional details here"
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </form>
          {/* </div> */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default TripPlan;
