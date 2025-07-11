import { useState, useEffect } from "react";

const TripStartPlaceInput = ({ formData, setFormData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [query, setQuery] = useState(""); // Store search query

  // Fetch suggestions from OpenStreetMap API
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data.map((place) => place.display_name));
      } catch (error) {
        console.error("Error fetching places:", error);
      }
      setLoading(false);
    };

    const delayFetch = setTimeout(fetchPlaces, 300); // Delay fetch to avoid frequent API calls
    return () => clearTimeout(delayFetch);
  }, [query]);

  // Handle input change and update query
  const handleInputChange = (value, index) => {
    setQuery(value);
    const updatedTripStartPlace = [...formData.tripStartPlace];
    updatedTripStartPlace[index] = value;
    setFormData({ ...formData, tripStartPlace: updatedTripStartPlace });
    setActiveIndex(index); // Keep focus on current field
  };

  // Handle selection from suggestions
  const selectSuggestion = (suggestion, index) => {
    const updatedTripStartPlace = [...formData.tripStartPlace];
    updatedTripStartPlace[index] = suggestion;
    setFormData({ ...formData, tripStartPlace: updatedTripStartPlace });
    setSuggestions([]); // Hide suggestions after selection
    setActiveIndex(null);
  };

  return (
    <div>
      {formData.tripStartPlace.map((tripStartPlace, index) => (
        <div key={index} className="mb-4 relative">
          <input
            type="text"
            value={tripStartPlace}
            onChange={(e) => handleInputChange(e.target.value, index)}
            onFocus={() => setActiveIndex(index)}
            className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Add your trip start place"
          />

          {/* Show suggestions only for the active input field */}
          {activeIndex === index && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-auto shadow-lg rounded-md">
              {suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  onMouseDown={() => selectSuggestion(suggestion, index)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {loading && activeIndex === index && (
            <p className="text-sm text-gray-600">Loading...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TripStartPlaceInput;
