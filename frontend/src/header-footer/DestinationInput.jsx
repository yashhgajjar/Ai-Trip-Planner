import { useState, useEffect } from "react";

const DestinationInput = ({ formData, setFormData }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [query, setQuery] = useState(""); // Store query separately

  // Fetch places from OpenStreetMap API
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

    const delayFetch = setTimeout(fetchPlaces, 300); // Fetch after 300ms delay
    return () => clearTimeout(delayFetch); // Clear timeout if user types fast
  }, [query]);

  // Handle input change and update query
  const handleInputChange = (value, index) => {
    setQuery(value); // Update search query
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = value;
    setFormData({ ...formData, destinations: updatedDestinations });
    setActiveIndex(index); // Keep focus on the field
  };

  // Handle selection from suggestions
  const selectSuggestion = (suggestion, index) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = suggestion;
    setFormData({ ...formData, destinations: updatedDestinations });
    setSuggestions([]); // Hide suggestions after selection
    setActiveIndex(null);
  };

  // Add new destination field
  const addDestination = () => {
    setFormData({ ...formData, destinations: [...formData.destinations, ""] });
  };

  // Remove destination field
  const removeDestination = (index) => {
    const updatedDestinations = formData.destinations.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, destinations: updatedDestinations });
  };

  return (
    <div>
      {formData.destinations.map((destination, index) => (
        <div key={index} className="mb-4 relative">
          <div className="flex items-center">
            <input
              type="text"
              value={destination}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onFocus={() => setActiveIndex(index)}
              className="w-full p-3 border border-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder={`Destination ${index + 1}`}
            />
            {formData.destinations.length > 1 && (
              <button
                type="button"
                onClick={() => removeDestination(index)}
                className="ml-2 px-2 py-1 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
              >
                ✖
              </button>
            )}
          </div>

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

export default DestinationInput;
