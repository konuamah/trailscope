"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import useAuthStore from "../store/auth";

const TrailListPage = () => {
  const [trails, setTrails] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    difficulty: "",
    created_by: "",
    limit: "",
    order_by: "id",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrails();
  }, [filters]);

  axios.defaults.baseURL = "http://localhost:8000";

  const fetchTrails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/trails/trails/", { params: filters });
      setTrails(response.data);
    } catch (err) {
      setError("Failed to load trails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <main className="flex justify-center items-center min-h-screen font-sans">
      <div>
        <h1 className="text-blue-700 text-center text-2xl font-bold mb-6"> All Trails</h1>

        <div className="mb-4">
          <label className="text-lg text-black font-semibold mb-2">Difficulty:</label>
          <select
            name="difficulty"
            onChange={handleFilterChange}
            className="p-2 w-full max-w-xs border-2 bg-stone-600 border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Show All</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>

        {loading ? (
          <p>Loading trails...</p>
        ) : error ? (
          <p>{error}</p>
        ) : trails.length === 0 ? (
          <p className="text-red-700 font-semibold">No trails found for the selected difficulty.</p>
        ) : (
          <div className="flex justify-center items-center min-h-screen font-sans">
            <div className="bg-white border border-gray-300 p-6 max-w-lg w-full">
              <h1 className="text-blue-700 text-2xl font-bold mb-6">Featured Trails</h1>
              <ul className="space-y-6">
                {trails.map((trail) => (
                  <li key={trail.id} className="pb-4 border-b border-dashed border-gray-300">
                    <Link href={`trail_detail/${trail.id}`} className="group">
                      <h2 className="text-black text-lg font-bold group-hover:text-blue-700">{trail.name}</h2>
                      <img
                        src={`http://localhost:8000${trail.image}`}
                        alt={trail.name}
                        className="w-full h-auto border border-blue-500 rounded-md shadow-md mt-2"
                      />
                      <p className="mt-2 text-gray-700 text-sm">
                        Difficulty: <span className="font-bold">{trail.difficulty}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default TrailListPage;
