"use client"; // Ensures client-side rendering

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory routing
import useAuthStore from '../store/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Access login function from Zustand
  const login = useAuthStore((state) => state.login);
  
  // Initialize the router
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);  // Call the Zustand function

    // Check if login was successful
    if (success) {
      router.push('/'); // Redirect to homepage
    } else {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Username</label>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />

      <label>Password</label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
