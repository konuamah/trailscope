'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import useAuthStore from '@/app/store/auth';

export default function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || !token) {
        setError('Missing username or authentication token');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/users/${username}`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.data) {
          setUserData(response.data);
          setNewUsername(response.data.username);
        } else {
          setError('No user data received');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user data');
        console.error('Detailed error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, token]);

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/users/${username}/`,
        { username: newUsername },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        setUserData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update username');
      console.error('Update error:', err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    return <p>No user data found</p>;
  }

  return (
    <div>
      <h1>Edit Profile: {userData.username}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={newUsername}
            onChange={handleUsernameChange}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}