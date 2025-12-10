import axios from 'axios';

// Create an axios instance
const api = axios.create({
  // If we are in production (live), use the live URL. 
  // If in development (local), use localhost.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export default api;
