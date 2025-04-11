import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../header-footer/footer";
import Header from "../header-footer/header";
import axios from "axios";
import moment from "moment";

const API_KEY = "a36c8bc734d27c9e4671655829c03386"; // OpenWeatherMap API key

const CheckWether = () => {
  const location = useLocation();
  const storedTripData = JSON.parse(localStorage.getItem("tripData")) || {};
  const { destinations, startDate, endDate } = location.state || storedTripData;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [dateIndices, setDateIndices] = useState({});

  useEffect(() => {
    if (destinations && startDate && endDate) {
      fetchWeatherData();
    }
  }, [destinations, startDate, endDate]);

  // Generate all travel dates
  const getTravelDates = () => {
    const dates = [];
    let currentDate = moment(startDate);
    const end = moment(endDate);

    while (currentDate.isSameOrBefore(end, "day")) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }

    return dates;
  };

  // Extract city name from destination
  const extractCity = (destination) => {
    const parts = destination.split(",").map((part) => part.trim());
    if (parts[parts.length - 1] === "India") {
      parts.pop();
    }
    const lastPart = parts[parts.length - 1];
    const isPinCode = /^\d{4,6}$/.test(lastPart);
    return isPinCode ? parts[parts.length - 2] : lastPart;
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    const weatherResults = {};
    const indices = {};

    for (const destination of destinations) {
      const city = extractCity(destination);
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        weatherResults[destination] = response.data.list || null;
        indices[destination] = 0;
      } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        weatherResults[destination] = null;
        indices[destination] = 0;
      }
    }
    setWeatherData(weatherResults);
    setDateIndices(indices);
  };

  // Navigation functions for switching dates (per city)
  const prevDate = (destination) => {
    setDateIndices((prev) => ({
      ...prev,
      [destination]: prev[destination] > 0 ? prev[destination] - 1 : 0,
    }));
  };

  const nextDate = (destination) => {
    setDateIndices((prev) => ({
      ...prev,
      [destination]:
        prev[destination] < getTravelDates().length - 1
          ? prev[destination] + 1
          : prev[destination],
    }));
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

      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mt-4">
          🌍 Weather Forecast
        </h1>

        {destinations && startDate && endDate ? (
          <div className="mt-6 text-lg text-gray-700">
            <p className="text-xl font-semibold">
              📅 <span className="text-blue-500">Travel Dates:</span>
              <span className="text-blue-400">
                {" "}
                {startDate} to {endDate}
              </span>
            </p>

            {/* Responsive Container */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {destinations.map((destination, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 w-full max-w-md mx-auto sm:mx-0 flex flex-col items-center justify-between h-full"
                >
                  {/* City Name with Fixed Height */}
                  <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center uppercase tracking-wide min-h-[50px] flex items-center justify-center">
                    {extractCity(destination)}
                  </h2>

                  {weatherData[destination] ? (
                    <div className="p-6 bg-gray-100 text-center rounded-lg shadow-md w-full">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                        {moment(
                          getTravelDates()[dateIndices[destination]]
                        ).format("dddd, MMM D")}
                      </h3>

                      {/* Temperature & Weather Info */}
                      {(() => {
                        const date = getTravelDates()[dateIndices[destination]];
                        const forecast = weatherData[destination].find((f) =>
                          f.dt_txt.startsWith(date)
                        );
                        return forecast ? (
                          <>
                            <div className="flex flex-col items-center space-y-4">
                              <div className="text-4xl font-bold text-blue-700 sm:text-6xl">
                                {forecast.main.temp}°C
                              </div>
                              <img
                                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                alt="Weather"
                                className="w-20 h-20 mx-auto"
                              />
                              <p className="text-lg text-gray-800 font-medium">
                                ☁️ {forecast.weather[0].description}
                              </p>
                            </div>
                          </>
                        ) : (
                          <p className="text-red-500">No forecast available</p>
                        );
                      })()}

                      {/* Navigation Buttons */}
                      <div className="flex justify-center gap-4 mt-6">
                        <button
                          className="px-4 py-2 border border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-full"
                          onClick={() => prevDate(destination)}
                          disabled={dateIndices[destination] === 0}
                        >
                          ⬅️
                        </button>
                        <button
                          className="px-4 py-2 border border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white rounded-full"
                          onClick={() => nextDate(destination)}
                          disabled={
                            dateIndices[destination] ===
                            getTravelDates().length - 1
                          }
                        >
                          ➡️
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500 text-lg text-center font-medium mt-4">
                      Weather data not available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-red-500 mt-6 text-lg font-semibold">
            ⚠️ No trip data available.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CheckWether;
