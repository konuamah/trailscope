"use client"
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useAuthStore from '../store/auth';

// Function to calculate line length and elevation profile


const TrailCreationForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [difficultyRating, setDifficultyRating] = useState(1);
    const [coordinates, setCoordinates] = useState([]);
    const [trailMetrics, setTrailMetrics] = useState(null);
    const [apiError, setApiError] = useState(null);
  
    const MapClickHandler = () => {
      useMapEvents({
        click: (e) => {
          const newCoord = [e.latlng.lat, e.latlng.lng];
          setCoordinates((prev) => [...prev, newCoord]);
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
      
        const trailData = {
          name,
          description,
          difficulty_rating: difficultyRating,
          geometry: {
            type: 'LineString',
            coordinates: coordinates.map(coord => [coord[1], coord[0]]) // Swap lat/lon for GeoJSON
          },
          elevation_profile: trailMetrics.elevationProfile.map(point => ({
            point: [point.point[1], point.point[0]], // Swap lat/lon
            elevation: point.elevation
          })),
          length_meters: trailMetrics.length,
          status: 'Active',
        };
      
        console.log('Submitting trail data:', trailData);
      
        try {
          const response = await fetch('http://localhost:8000/trails/trails/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${useAuthStore.getState().token}`,
            },
            body: JSON.stringify(trailData),
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error creating trail: ${errorText}`);
          }
          const data = await response.json();
          console.log('Trail created:', data);
        } catch (error) {
          console.error('Submission error:', error);
          setApiError(error.message);
        }
      };
      
  
    return (
      <div className="p-4 max-w-4xl mx-auto bg-black">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Trail Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Trail Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Difficulty Rating"
            value={difficultyRating}
            onChange={(e) => setDifficultyRating(e.target.value)}
            required
          />
          <button type="submit">Create Trail</button>
        </form>
  
        <div className="h-96">
          <MapContainer 
            center={[0, 0]} 
            zoom={2} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/{z}/{x}/{y}?access_token=sk.eyJ1Ijoia29maW93dXN1IiwiYSI6ImNtMWV3Z3FkYjMyeW0ya3NjNW93NHk3Z2gifQ.NVzlEBzcmoK-Bdeye-N_LQ"
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong>Error: </strong>{apiError}
          </div>
        )}
  
        {trailMetrics && (
          <div>
            <h3>Trail Metrics</h3>
            <p>Length: {trailMetrics.length.toFixed(2)} meters</p>
            <p>Elevation Points: {trailMetrics.elevationProfile.length}</p>
          </div>
        )}
      </div>
    );
  };
  
  export default TrailCreationForm;
