"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dynamically import the map components with ssr: false
const Map = dynamic(
  () => import("../../components/trailMap"), // We'll create this component separately
  { ssr: false }
);

const TrailDetailPage = () => {
  const params = useParams();
  const id = params.id;
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      console.log("Trail ID:", id); // Add this for debugging
      const fetchTrailDetail = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:8000/trails/trails/${id}/`
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setTrail(data);
          setError(null);
        } catch (error) {
          console.error("Error fetching trail details:", error);
          setError("Failed to load trail details");
          setTrail(null);
        } finally {
          setLoading(false);
        }
      };
      fetchTrailDetail();
    }
  }, [id]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-lg">
        Loading trail details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-lg">
        Trail not found
      </div>
    );
  }

  const elevationData = trail.elevation_profile || [];

  const chartData = {
    labels: elevationData.map((_, index) => index + 1),
    datasets: [
      {
        label: "Elevation",
        data: elevationData.map((dataPoint) => dataPoint.elevation),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Point (Index or Distance)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Elevation (meters)",
        },
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 font-sans text-center text-white p-4">
      <div className="bg-white text-black max-w-2xl w-full p-6 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">{trail.name}</h1>
        <p className="mb-2">{trail.description}</p>
        <p className="mb-2">
          <span className="font-bold">Length:</span> {trail.length_meters} meters
        </p>
        <img
          src={`http://localhost:8000${trail.image}`}
          alt={trail.name}
          className="w-full h-auto rounded-md border border-blue-500 shadow-md mt-4 mb-4"
        />
        <p className="mb-2">
          <span className="font-bold">Status:</span> {trail.status}
        </p>
        <p className="mb-4">
          <span className="font-bold">Difficulty:</span> {trail.difficulty_rating}
        </p>

        <Map trail={trail} />

        {elevationData.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              Elevation Profile
            </h2>
            <div className="overflow-hidden p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-inner">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        ) : (
          <p className="mt-6">No elevation profile available</p>
        )}
      </div>
    </div>
  );
};

export default TrailDetailPage;