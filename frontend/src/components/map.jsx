// Map.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon for user location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// MapUpdater Component
const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 12);
  }, [lat, lon, map]);
  return null;
};

// LocationSelector Component
const LocationSelector = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        const data = await response.json();
        const placeName = data.display_name || "Selected Location";
        onLocationSelect({ lat, lon: lng, name: placeName });
      } catch (error) {
        console.error("Error fetching place name:", error);
        alert("Unable to fetch location details. Please try again.");
      }
    },
  });
  return null;
};

// LocationFinder Component
const LocationFinder = ({ onLocationFound }) => {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    map.locate({ setView: true, maxZoom: 16 });
  };

  const onLocationFoundInternal = (e) => {
    const radius = e.accuracy / 2;
    L.marker(e.latlng)
      .addTo(map)
      .bindPopup("You are within " + radius + " meters from this point")
      .openPopup();
    L.circle(e.latlng, radius).addTo(map);
    onLocationFound(e.latlng.lat, e.latlng.lng);
  };

  const onLocationError = (e) => {
    alert(
      "Unable to retrieve your location. Please ensure location services are enabled and try again."
    );
  };

  useEffect(() => {
    map.on("locationfound", onLocationFoundInternal);
    map.on("locationerror", onLocationError);

    return () => {
      map.off("locationfound", onLocationFoundInternal);
      map.off("locationerror", onLocationError);
    };
  }, [map, onLocationFound]);

  return (
    <button
      style={{
        position: "absolute",
        top: "10px",
        right: "12px",
        zIndex: 1000,
        padding: "10px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={locate}
      tabIndex={0}
      aria-label="Locate my current position"
    >
      Locate Me
    </button>
  );
};

const Map = () => {
  const [city, setCity] = useState("");
  const [tripLocation, setTripLocation] = useState({
    lat: 21.77305409099849,
    lon: 69.60792611694337,
  });
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility on mobile

  // City Suggestions states
  const [startLocation, setStartLocation] = useState("Janak Nagar, Morbi");
  const [endLocation, setEndLocation] = useState("Tankara, Morbi");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [startLoading, setStartLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState(false);
  const [directions, setDirections] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapType, setMapType] = useState("simple");

  // Accommodation Types State
  const [accommodationTypes, setAccommodationTypes] = useState({
    apartments: false,
    guest_houses: false,
    campsites: false,
    resorts: false,
    motels: false,
    hotels: false,
    hostels: false,
    villas: false,
    alpine_huts: false,
    love_hotels: false,
  });

  const [accommodations, setAccommodations] = useState([]);

  // Use useRef instead of createRef
  const mapRef = useRef(null);

  const handleAccommodationTypeChange = (type) => {
    setAccommodationTypes({
      ...accommodationTypes,
      [type]: !accommodationTypes[type],
    });
  };

  const fetchAccommodations = useCallback(async () => {
    if (mapRef.current) {
      const bbox = mapRef.current.getBounds().toBBoxString();
      // Filter for selected types
      const selectedTypes = Object.keys(accommodationTypes).filter(
        (type) => accommodationTypes[type]
      );

      if (selectedTypes.length === 0) {
        setAccommodations([]);
        return;
      }

      try {
        const response = await axios.get(
          `/api/opentripmap/accommodations?bbox=${bbox}&types=${selectedTypes.join(
            ","
          )}`
        );

        setAccommodations(response.data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setError("Failed to load accommodations. Please try again later.");
      }
    }
  }, [accommodationTypes]);

  const handleMapMove = useCallback(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  useEffect(() => {
    // Use if (mapRef.current) check to prevent error
    if (mapRef.current) {
      mapRef.current.on("moveend", handleMapMove);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("moveend", handleMapMove);
      }
    };
  }, [handleMapMove]);

  useEffect(() => {
    // Fetch accommodations initially only after mapRef is available
    if (mapRef.current) {
      fetchAccommodations();
    }
  }, [fetchAccommodations]);

  const handleLocationFound = useCallback(
    (newLat, newLon) => {
      setCity("");
    },
    [setCity]
  );

  const getTileLayerURL = () => {
    return mapType === "simple"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  };

  useEffect(() => {
    const fetchStartSuggestions = async () => {
      if (!startLocation) {
        setStartSuggestions([]);
        return;
      }
      setStartLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            startLocation
          )}&limit=5`
        );
        const data = await response.json();
        setStartSuggestions(
          data.map((place) => ({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
        );
      } catch (error) {
        console.error("Error fetching start location suggestions:", error);
      }
      setStartLoading(false);
    };

    const fetchEndSuggestions = async () => {
      if (!endLocation) {
        setEndSuggestions([]);
        return;
      }
      setEndLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            endLocation
          )}&limit=5`
        );
        const data = await response.json();
        setEndSuggestions(
          data.map((place) => ({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
        );
      } catch (error) {
        console.error("Error fetching end location suggestions:", error);
      }
      setEndLoading(false);
    };

    const delay = 300;
    const startTimeoutId = setTimeout(fetchStartSuggestions, delay);
    const endTimeoutId = setTimeout(fetchEndSuggestions, delay);

    return () => {
      clearTimeout(startTimeoutId);
      clearTimeout(endTimeoutId);
    };
  }, [startLocation, endLocation]);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setTripLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            setError("Error getting location: " + error.message);
            console.error("Error getting location:", error);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getCurrentLocation();

    const fetchSuggestions = async () => {
      if (!city) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            city
          )}&limit=5`
        );
        const data = await response.json();
        setSuggestions(
          data.map((place) => ({
            name: place.display_name,
            lat: place.lat,
            lon: place.lon,
          }))
        );
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
      setLoading(false);
    };

    const delayFetch = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(delayFetch);
    };
  }, [city]);

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setTripLocation({
      lat: parseFloat(selectedCity.lat),
      lon: parseFloat(selectedCity.lon),
    });
    setSuggestions([]);
    setError("");
  };

  const fetchDirections = async () => {
    try {
      const startGeocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${startLocation}`
      );
      const endGeocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${endLocation}`
      );

      if (
        startGeocodeResponse.data.length === 0 ||
        endGeocodeResponse.data.length === 0
      ) {
        alert("Could not find the given start or end location.");
        return;
      }

      const startCoords = [
        startGeocodeResponse.data[0].lat,
        startGeocodeResponse.data[0].lon,
      ];
      const endCoords = [
        endGeocodeResponse.data[0].lat,
        endGeocodeResponse.data[0].lon,
      ];

      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/car/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?geometries=geojson&steps=true`
      );

      if (response.data.routes && response.data.routes.length > 0) {
        setRouteCoordinates(
          response.data.routes[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ])
        );
      } else {
        alert("Could not find a route between the specified locations.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      alert("Error fetching directions. Please try again.");
    }
  };

  return (
    <>
      <Header />
      {/* Main Content Container */}
      <div className="flex bg-gray-100 min-h-screen">
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="md:hidden bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ position: "fixed", top: "70px", left: "10px", zIndex: 1001 }}
        >
          {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        </button>

        {/* Sidebar */}
        <div
          className={`bg-white shadow-lg pt-20 ${
            isSidebarOpen ? "block" : "hidden"
          } md:block`}
          style={{
            width: "280px",
            height: "100%", // Take up the full height
            overflowY: "auto",
            position: "relative",
          }}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Find Route &amp; Direction
            </h2>

            <div className="mb-4">
              <label
                htmlFor="startLocation"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Search Place:
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Enter start location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  aria-label="Search for a city"
                  aria-expanded={isDropdownOpen}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                />
                <button
                  onClick={() =>
                    handleSelectCity({
                      name: city,
                      lat: tripLocation.lat,
                      lon: tripLocation.lon,
                    })
                  }
                  className="p-2 bg-blue-600 text-white rounded-md"
                >
                  Search
                </button>

                {/* Loading Indicator */}
                {loading && (
                  <p className="absolute left-0 top-full mt-1 text-sm text-gray-600 bg-white px-2 py-1 rounded-md">
                    Loading...
                  </p>
                )}

                {/* Suggestions List */}
                {isDropdownOpen && suggestions.length > 0 && (
                  <ul className="absolute left-0 top-full mt-8 w-full bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onMouseDown={() => handleSelectCity(suggestion)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="startLocation"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Chnage Theme:
              </label>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMapType("simple")}
                  className={`p-2 bg-gray-100 text-gray-700 rounded-md border-1 border-black mr-4 ${
                    mapType === "simple"
                      ? "bg-blue-500 text-blue-700 mr-4 border-1 border-black"
                      : ""
                  }`}
                >
                  Simple Map
                </button>
                <button
                  onClick={() => setMapType("earth")}
                  className={`p-2 bg-gray-100 text-gray-700 rounded-md mr-4 border-1 border-black${
                    mapType === "earth"
                      ? "bg-blue-500 text-blue-700 border-1 border-black "
                      : ""
                  }`}
                >
                  Earth Map
                </button>
              </div>
            </div>
            {/* Start Location Input */}
            <div className="mb-4">
              <label
                htmlFor="startLocation"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Start Location:
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="startLocation"
                  placeholder="Enter start location"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  onFocus={() => setIsStartDropdownOpen(true)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {startLoading && (
                  <p className="absolute left-0 top-full mt-1 text-sm text-gray-600 bg-white px-2 py-1 rounded-md">
                    Loading...
                  </p>
                )}
                {isStartDropdownOpen && startSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-auto">
                    {startSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onMouseDown={() => {
                          setStartLocation(suggestion.name);
                          setStartSuggestions([]);
                          setIsStartDropdownOpen(false);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* End Location Input */}
            <div className="mb-6">
              <label
                htmlFor="endLocation"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                End Location:
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="endLocation"
                  placeholder="Enter end location"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  onFocus={() => setIsEndDropdownOpen(true)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {endLoading && (
                  <p className="absolute left-0 top-full mt-1 text-sm text-gray-600 bg-white px-2 py-1 rounded-md">
                    Loading...
                  </p>
                )}
                {isEndDropdownOpen && endSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 shadow-lg rounded-md max-h-40 overflow-auto">
                    {endSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onMouseDown={() => {
                          setEndLocation(suggestion.name);
                          setEndSuggestions([]);
                          setIsEndDropdownOpen(false);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Find Route Button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={fetchDirections}
              >
                Find Route
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2">
                Accommodations
              </h2>
              {Object.entries(accommodationTypes).map(([type, checked]) => (
                <div key={type} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={() => handleAccommodationTypeChange(type)}
                    />
                    {type.replace("_", " ")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 p-4">
          {error && <div className="text-red-500">{error}</div>}

          {tripLocation ? (
            <div className="flex items-center w-full h-[80vh] mx-auto rounded-2xl overflow-hidden shadow-lg relative mt-20">
              <MapContainer
                center={[tripLocation.lat, tripLocation.lon]}
                zoom={13}
                ref={mapRef}
                className="w-full h-full rounded-2xl"
                style={{ zIndex: 1 }}
              >
                <TileLayer url={getTileLayerURL()} />
                <MapUpdater lat={tripLocation.lat} lon={tripLocation.lon} />
                <LocationSelector onLocationSelect={handleSelectCity} />
                <LocationFinder onLocationFound={handleLocationFound} />

                {suggestions.length === 0 && city && tripLocation && (
                  <Marker position={[tripLocation.lat, tripLocation.lon]}>
                    <Popup>{city}</Popup>
                  </Marker>
                )}

                {routeCoordinates.length > 0 && (
                  <Polyline
                    positions={routeCoordinates}
                    color="blue"
                    weight={5}
                  />
                )}

                {accommodations.map((accommodation) => {
                  if (
                    accommodation.type === "node" ||
                    accommodation.type === "way"
                  ) {
                    const lat = accommodation.lat || accommodation.center?.lat;
                    const lon = accommodation.lon || accommodation.center?.lon;
                    const name = accommodation.tags?.name || "Accommodation";
                    const accommodationType =
                      accommodation.tags?.tourism || "Accommodation";

                    if (lat && lon) {
                      return (
                        <Marker key={accommodation.id} position={[lat, lon]}>
                          <Popup>
                            {name} ({accommodationType})
                          </Popup>
                        </Marker>
                      );
                    }
                  }
                  return null;
                })}
              </MapContainer>
            </div>
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Map;
