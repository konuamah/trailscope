import { create } from 'zustand';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:8000';

// Zustand Store for Auth State
const useAuthStore = create((set) => {
  let token = null;

  // Check if running in the browser
  if (typeof window !== "undefined") {
    token = localStorage.getItem('token'); // Safe access to localStorage
  }

  const isAuthenticated = !!token;

  return {
    user: null,            
    token,          
    isAuthenticated,  

    // Register User
    register: async (username, email, password) => {
      try {
        console.log("Attempting to register with", { username, email, password });
        const response = await axios.post('/users/register/', {
          username,
          email,
          password,
        });
        console.log("Registration successful:", response.data);
        alert("Registration successful");
        return true; 
      } catch (error) {
        console.error("Registration failed", error.response?.data || error.message);
        return false; 
      }
    },

    // Login User
    login: async (username, password) => {
      try {
        console.log("Attempting to login with", { username, password });
        const response = await axios.post('/users/login/', {
          username,
          password,
        });

        const { token, user } = response.data;
        console.log("Login successful:", { token, user });

        set({
          user,
          token,
          isAuthenticated: true,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem('token', token);
          console.log("Token stored in localStorage");
        }
        
        return true; 
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        return false; 
      }
    },

    // Logout User
    logout: () => {
      console.log("Logging out...");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem('token');  
        console.log("Token removed from localStorage");
      }
    },
  };
});

export default useAuthStore;
