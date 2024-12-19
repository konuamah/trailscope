import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';  // Import geocoder styles

const SearchControl = ({ searchQuery, setSearchQuery }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const map = useMap();

  const searchLocation = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    map.setView([lat, lon], 13);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-64">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Location"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.length > 2) {
              searchLocation(e.target.value);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }}
          className="w-full p-2 border rounded"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchControl;