"use client";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TrailMap = ({ trail }) => {
  if (typeof window === "undefined") return null;

  const points = Object.entries(trail.geometry).map(([longitude, latitude]) => [
    parseFloat(latitude),
    parseFloat(longitude),
  ]);

  const center = points.length > 0
    ? points[Math.floor(points.length / 2)]
    : [6.5, -1.5];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      <MapContainer
        center={center}
        zoom={10}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {points.length > 0 && (
          <Polyline
            positions={points}
            pathOptions={{
              color: "#3B82F6",
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TrailMap;