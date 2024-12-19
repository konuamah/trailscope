"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useAuthStore from '../store/auth';
import SearchControl from '../components/searchControl';







const TrailCreationForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficultyRating, setDifficultyRating] = useState(1);
  const [coordinates, setCoordinates] = useState([]);
  const [trailMetrics, setTrailMetrics] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [image, setImage] = useState(null); // for image upload
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);


  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const clickedElement = e.originalEvent.target;
  
        // Check if the click came from inside the search box
        if (!document.getElementById("search-box").contains(clickedElement)) {
          // Add coordinates logic here
          setCoordinates([...coordinates, [e.latlng.lat, e.latlng.lng]]);
        }
      },
    });
    return null;
  };
  

  useEffect(() => {
    if (coordinates.length > 1) {
      calculateTrailMetrics(coordinates).then((metrics) => {
        setTrailMetrics(metrics);
        if (metrics.error) {
          setApiError(metrics.error);
        } else {
          setApiError(null);
        }
      });
    }
  }, [coordinates]);

  const calculateTrailMetrics = async (coordinates) => {
    try {
      console.log('Calculating metrics for coordinates:', coordinates);

      if (!coordinates || coordinates.length < 2) {
        throw new Error('Not enough coordinates to calculate metrics');
      }

      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
      };

      const trailLength = coordinates.reduce((total, point, index) => {
        if (index > 0) {
          const [prevLat, prevLon] = coordinates[index - 1];
          const [currLat, currLon] = point;
          return total + calculateDistance(prevLat, prevLon, currLat, currLon);
        }
        return total;
      }, 0);

      const latitudes = coordinates.map((coord) => coord[0]).join(',');
      const longitudes = coordinates.map((coord) => coord[1]).join(',');

      console.log('Fetching elevation data...');
      const response = await fetch(
        `https://api.open-meteo.com/v1/elevation?latitude=${latitudes}&longitude=${longitudes}`,
        { method: 'GET', headers: { 'Accept': 'application/json' } }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch elevation data: ${errorText}`);
      }

      const data = await response.json();
      console.log('Elevation data received:', data);

      if (!data.elevation || data.elevation.length !== coordinates.length) {
        throw new Error('Incomplete elevation data received');
      }

      const elevationProfile = coordinates.map((point, index) => ({
        point,
        elevation: data.elevation[index],
      }));

      console.log('Calculated trail metrics:', { length: trailLength, elevationProfile });
      return { length: trailLength, elevationProfile };
    } catch (error) {
      console.error('Error calculating trail metrics:', error);
      return {
        length: coordinates.reduce((total, point, index) => {
          if (index > 0) {
            const [prevLat, prevLon] = coordinates[index - 1];
            const [currLat, currLon] = point;
            return total + calculateDistance(prevLat, prevLon, currLat, currLon);
          }
          return total;
        }, 0),
        elevationProfile: coordinates.map((point) => ({ point, elevation: null })),
        error: error.message
      };
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('difficulty_rating', difficultyRating);
    formData.append('length_meters', trailMetrics.length);
    formData.append('status', 'Active');
    formData.append(
      'geometry',
      JSON.stringify({
        type: 'LineString',
        coordinates: coordinates.map(coord => [coord[1], coord[0]]), // Swap lat/lon
      })
    );
    formData.append(
      'elevation_profile',
      JSON.stringify(
        trailMetrics.elevationProfile.map(point => ({
          point: [point.point[1], point.point[0]], // Swap lat/lon
          elevation: point.elevation,
        }))
      )
    );
  
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trails/trails/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${useAuthStore.getState().token}`,
        },
        body: formData, // Correct payload format
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating trail: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Trail created:', data);
      alert('Trail created successfully!');
      window.history.back();
  
    } catch (error) {
      console.error('Submission error:', error);
      setApiError(error.message);
    }
  };
  
  

   


  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
      setImageFile(file); // Save the file for submission
    }
  };
  
  

  // Clear all points
  const handleClearPoints = () => {
    setCoordinates([]);
  };

  // Clear last point
  const handleClearLastPoint = () => {
    setCoordinates((prev) => prev.slice(0, prev.length - 1));
  };



  return (
    <div className="p-4 max-w-4xl mx-auto text-center bg-gray-100 border-4 border-gray-800">
      <h1 className="text-4xl font-bold mb-4 font-serif text-blue-900 underline">Add trail</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Trail Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block mx-auto border-2 border-gray-800 p-2 text-lg"
        />
  
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block mx-auto border-2 border-gray-800 p-2 text-lg"
        />
        {image && <img src={image} alt="Uploaded Trail" className="mt-4 mx-auto h-48 border-2 border-gray-800" />}
  
        <button
          type="button"
          onClick={handleClearPoints}
          className="block mx-auto bg-red-600 text-white py-2 px-6 border-2 border-gray-800 font-bold"
        >
          Clear All Points
        </button>
  
        <button
          type="button"
          onClick={handleClearLastPoint}
          className="block mx-auto bg-yellow-500 text-black py-2 px-6 border-2 border-gray-800 font-bold"
        >
          Clear Last Point
        </button>
  
        <textarea
          placeholder="Trail Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="block mx-auto border-2 border-gray-800 p-2 text-lg"
        />
  
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Difficulty Rating"
          value={difficultyRating}
          onChange={(e) => setDifficultyRating(e.target.value)}
          required
          className="block mx-auto border-2 border-gray-800 p-2 text-lg"
        />
  
        <button
          type="submit"
          className="block mx-auto bg-green-600 text-white py-2 px-6 border-2 border-gray-800 font-bold"
        >
          Create Trail
        </button>
      </form>
  
      <div className="relative h-96 mt-8 border-4 border-gray-800">
      <MapContainer 
  center={[0, 0]} 
  zoom={2} 
  style={{ height: '100%', width: '100%' }}
>
  <div id="search-box">
    <SearchControl searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  </div>
  <TileLayer
    url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
    attribution="&copy; Mapbox"
    tileSize={512}
    zoomOffset={-1}
  />
  <MapClickHandler />
  {coordinates.length > 1 && (
    <Polyline positions={coordinates} color="blue" />
  )}
</MapContainer>

      </div>
  
      {apiError && (
        <div className="bg-red-200 border-4 border-red-800 text-red-900 px-6 py-4 mt-4 font-bold text-lg">
          <strong>Error:</strong> {apiError}
        </div>
      )}
  
      {trailMetrics && (
        <div className="mt-8 p-4 border-4 border-gray-800 text-black bg-gray-200">
          <h3 className="text-2xl font-bold">Trail Metrics</h3>
          <p className="text-lg">Length: {trailMetrics.length.toFixed(2)} meters</p>
          <p className="text-lg">Elevation Points: {trailMetrics.elevationProfile.length}</p>
        </div>
      )}
    </div>
  );
  };


export default TrailCreationForm;
