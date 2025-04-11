import React, { useState, useEffect } from "react";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import axios from "axios";
import im13 from "../assets/im12.jpg";

const ShareExp = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // Show 9 cards per page

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/experiences`
        );
        setExperiences(response.data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    fetchExperiences();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(experiences.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const selectedCards = experiences.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div>
      {/* Header */}
      <Header
        buttons={
          isLoggedIn
            ? [
                { label: "Add Experience", path: "/userUpload" },
              ]
            : [
                { label: "Add Experience", path: "/userUpload" },
              ]
        }
      />

      {/* Hero Section */}
      <div className="w-full">
        <div
          className="flex flex-col items-center justify-center h-[50vh] w-full bg-cover bg-center px-8"
          style={{
            backgroundImage: `url(${im13})`,
          }}
        >
          {/* Heading */}
          <h1 className="text-white text-4xl font-bold mb-6">
            User Experiences
          </h1>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto mt-10 px-4 mb-4">
        {/* Grid Layout for Cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {selectedCards.length > 0 ? (
            selectedCards.map((exp, index) => (
              <li
                key={index}
                className="bg-white border-1 border-gray-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedExperience(exp)}
              >
                {/* Image Section */}
                {exp.photos && exp.photos.length > 0 && (
                  <div className="w-full h-56 overflow-hidden ">
                    <img
                      src={exp.photos[0]}
                      alt={exp.destination}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                    {exp.destination}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-semibold">By:</span> {exp.email}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold">From:</span> {exp.fromDate}{" "}
                    - {exp.toDate}
                  </p>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {exp.experience.substring(0, 120)}...
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No experiences found. Share your experience!
            </p>
          )}
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            className={`px-4 py-2 rounded-md text-white ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Selected Experience */}
      {selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white max-w-3xl w-full p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-2xl"
              onClick={() => setSelectedExperience(null)}
            >
              ✖
            </button>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedExperience.destination}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-semibold">By:</span>{" "}
              {selectedExperience.email}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-semibold">From:</span>{" "}
              {selectedExperience.fromDate} - {selectedExperience.toDate}
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {selectedExperience.experience}
            </p>

            {/* Image Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {selectedExperience.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Experience ${idx}`}
                  className="w-full h-32 object-cover rounded-md transform hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-200 py-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          ⭐ Traveler Reviews
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          Hear from users who planned their trips with us!
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              "This platform made my trip planning so easy! The AI suggestions
              were spot on."
            </p>
            <p className="text-gray-900 font-semibold mt-4">- Ankit Patel</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              "I loved the personalized recommendations. It felt like a travel
              agent but smarter!"
            </p>
            <p className="text-gray-900 font-semibold mt-4">- Riya Sharma</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              "Booking my dream trip was effortless. Highly recommended!"
            </p>
            <p className="text-gray-900 font-semibold mt-4">- Saurabh Mehta</p>
          </div>
        </div>
      </div>

      <div className="p-8 text-center ">
        <h2 className="text-3xl font-bold mb-4">Have a Story to Share? 🌎</h2>
        <p className="text-lg mb-4">
          Your travel experience could inspire someone! Share your journey with
          us.
        </p>
        <button
          onClick={() => (window.location.href = "/userUpload")}
          className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Share Your Experience
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShareExp;
