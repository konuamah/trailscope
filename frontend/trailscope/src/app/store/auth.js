import { create } from 'zustand';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:8000';

// Helper function to initialize auth state from localStorage
const initializeAuthState = () => {
  if (typeof window === "undefined") return { token: null, user: null };
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {
    token,
    user,
    isAuthenticated: !!token
  };
};

// Set up axios interceptor to add token to requests
const setupAxiosInterceptors = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const useAuthStore = create((set) => {
  // Initialize state from localStorage
  const initialState = initializeAuthState();
  
  // Set up axios interceptor with initial token
  setupAxiosInterceptors(initialState.token);
  
  return {
    ...initialState,
    
    register: async (username, email, password) => {
      try {
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

    login: async (username, password) => {
      try {
        const response = await axios.post('/users/login/', {
          username,
          password,
        });
        const { token, user } = response.data;
        
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Update axios headers
        setupAxiosInterceptors(token);
        
        // Update store state
        set({
          user,
          token,
          isAuthenticated: true,
        });
        
        return true;
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        return false;
      }
    },

    logout: () => {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Clear axios headers
      setupAxiosInterceptors(null);
      
      // Reset store state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  };
});

export default useAuthStore;