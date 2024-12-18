"use client";
import Link from "next/link";
import useAuthStore from "./store/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import "./globals.css";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const { user } = useAuthStore();
  const [trails, setTrails] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:8000/trails/trails/?limit=3")
      .then((response) => {
        // Map response to extract required fields
        const filteredTrails = response.data.map((trail) => ({
          id: trail.id,
          name: trail.name,
          image: trail.image, // Assuming the image field is a valid URL or path
          difficulty: trail.difficulty_rating,
        }));
        setTrails(filteredTrails);
      })
      .catch((err) => {
        setError("Failed to fetch trails.");
        console.error(err);
      });
  }, []);

  return (
    <div>
      <nav className=" border-2 bg-slate-600 border-solid border-gray-600 w-full p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center space-x-28">
          <div className="text-2xl font-bold">Trailscope</div>
          <div className="flex space-x-9 pr-4">
            <div>
              <Link href="how-it-works">How it works</Link>
            </div>
            {isAuthenticated && user ? (
  <div className="flex space-x-4">
    <Link href={`/profile/${user.username}`}>Profile</Link>
    <button onClick={logout}>Logout</button>
  </div>
) : (
  <>
    <div>
      <Link href="login">Login</Link>
    </div>
    <div>
      <Link href="register">Signup</Link>
    </div>
  </>
)}

          </div>
        </div>

        <p className="text-center font-bold pt-10 text-4xl ">
          Discover Hiking Trails<br></br>
          Near You!
        </p>

        <p className="text-center pt-10 text-4xl blink ">
          Find Hiking Trails
          <br />
        </p>
      </nav>

      <div className="text-center font-semibold text-black pt-2 text-4xl">Find the safest and family friendly trails</div>

      <div className="max-w-6xl mx-auto flex justify-between items-center">
  <div className="w-1/2 p-4 text-white">
    <img src="hero1.jpg" alt="Image 1" className="w-full  border-4 border-cyan-900 h-auto" />
  </div>
  <div className="w-1/2  p-4 text-white">
    <img src="hero2.jpg" alt="Image 2" className="w-full border-4 border-cyan-900 h-auto" />
  </div>
</div>


{isAuthenticated ? (
        <div className="text-emerald-600 blink text-center font-bold  text-4xl">
          <Link href="add-trail ">Add some trails! </Link>
        </div>
      ) : (
        <div className=" text-emerald-600 blink text-center font-bold  text-4xl">
          <Link href="login">Add some trails!</Link>
        </div>
      )}


<div class="flex justify-center items-center min-h-screen font-sans">
  <div class="bg-white border border-gray-300  p-6 max-w-lg w-full">
    <h1 class="text-blue-700 text-2xl font-bold mb-6 ">Featured Trails</h1>
    {error && <p class="text-red-700 font-semibold mb-4">{error}</p>}
    <ul class="space-y-6">
      {trails.map((trail) => (
        <li key={trail.id} class="pb-4 border-b border-dashed border-gray-300">
          <Link href={`trail_detail/${trail.id}`} class="group">
            <h2 class="text-black text-lg font-bold group-hover:text-blue-700">{trail.name}</h2>
            <img
              src={`http://localhost:8000${trail.image}`} // Update URL for images
              alt={trail.name}
              class="w-full h-auto border border-blue-500 rounded-md shadow-md mt-2"
            />
            <p class="mt-2 text-gray-700 text-sm">
              Difficulty: <span class="font-bold">{trail.difficulty}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
</div>

<div className="text-red-600 text-center font-bold  text-4xl">
          <Link href="trail-list">View all trails </Link>
        </div>


<footer className="bg-blue-600 text-white p-8 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4">
            <a href="#" className="mx-2 hover:underline">About Us</a>
            <span>|</span>
            <a href="#" className="mx-2 hover:underline">Contact</a>
            <span>|</span>
            <a href="#" className="mx-2 hover:underline">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="mx-2 hover:underline">Terms of Service</a>
          </div>
          <p className="text-sm">© 2000-2024 TrailFinder 2000. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
}
