'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Changed from next/router to next/navigation
import useAuthStore from '../store/auth';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore((state) => state.register);
  const router = useRouter(); // Now using next/navigation's useRouter
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
   
    if (success) {
      router.push('/login'); // Navigation remains the same
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <label>Username</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
