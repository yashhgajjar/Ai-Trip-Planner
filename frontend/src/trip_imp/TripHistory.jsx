import React, { useState, useEffect } from "react";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";

const TripHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState({}); // Store PDFs as { tripId: [pdfUrls] }

  // Fetch trips data when the component mounts
  useEffect(() => {
    if (userId) {
      fetchTrips(userId);
      setIsLoggedIn(true);
    }
  }, [userId]);

  // Function to fetch trips
  const fetchTrips = async (userId) => {
    try {
      const response = await fetch(
        `https://ai-trip-planner-qok6.onrender.com/api/trips/get-trips?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setTrips(data); // Set the trips data in state

        data.forEach((trip) => fetchTripPdfs(userId, trip._id));

      } else {
        console.error("Failed to fetch trips");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  const fetchTripPdfs = async (userId, tripId) => {
    try {
      const response = await fetch(
        `https://ai-trip-planner-qok6.onrender.com/api/trips/get-trip-pdfs?userId=${userId}&tripId=${tripId}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setPdfs((prev) => ({ ...prev, [tripId]: data.map((pdf) => pdf.pdfUrl) }));
      } else if (response.status !== 404) {
        // Ignore 404 errors, but log other errors
        console.error(`Error fetching PDFs for trip ${tripId}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching PDFs for trip ${tripId}:`, error);
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

      <div className="flex-grow bg-gray-50 p-8 pt-5">
        <div
          className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6"
          style={{
            boxShadow:
              "0 -4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)", // Shadows on top and bottom
          }}
        >
          <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
            Trip History
          </h1>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 mt-4">Loading trips...</p>
            ) : trips.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">
                No trips found for this user.
              </p>
            ) : (
              <div className="space-y-8">
                {trips.map((trip, index) => (
                  <div
                    key={index}
                    className="p-6 border border-gray-200 rounded-lg shadow-md bg-gray-200"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Trip {index + 1} -{" "}
                      {/* <span className="text-blue-500">ID: {trip._id}</span> */}
                    </h2>
                    <p className="text-gray-700 mt-2">
                      <strong>Start Date:</strong> {trip.startDate}
                    </p>
                    <p className="text-gray-700">
                      <strong>End Date:</strong> {trip.endDate}
                    </p>
                    <p className="text-gray-700">
                      <strong>Destinations:</strong>{" "}
                      {trip.destinations.join(", ")}
                    </p>
                    <p className="text-gray-700">
                      <strong>Budget:</strong> {trip.budget.join(", ")}
                    </p>
                    <p className="text-gray-700">
                      <strong>Trip Start Place:</strong> {trip.tripStartPlace}
                    </p>
                    <p className="text-gray-700">
                      <strong>Accommodation:</strong> {trip.accommodation}
                    </p>
                    <p className="text-gray-700">
                      <strong>Transportation:</strong> {trip.transportation}
                    </p>
                    <p className="text-gray-700">
                      <strong>Weather:</strong> {trip.weather}
                    </p>
                    <p className="text-gray-700">
                      <strong>Companions:</strong> {trip.companions}
                    </p>
                    <p className="text-gray-700">
                      <strong>Additional Notes:</strong> {trip.additionalNotes}
                    </p>
                    <div className="mt-4">
                      <strong>Preferences:</strong>
                      <ul className="list-disc ml-6 mt-2 text-gray-700">
                        {Object.entries(trip.preferences).map(
                          ([key, value]) => (
                            <li key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              {value ? "Yes" : "No"}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {pdfs[trip._id]?.length > 0 ? (
                      <div className="mt-4">
                        <strong>Download Your Trip Plan:</strong>
                        <ul className="list-disc ml-6 mt-2 text-gray-700">
                          {pdfs[trip._id].map((pdfUrl, i) => (
                            <li key={i}>
                              <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                Download PDF {i + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">No PDF available for this trip.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripHistory;
