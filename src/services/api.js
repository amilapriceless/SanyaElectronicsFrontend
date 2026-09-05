import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running.`;
    } else {
      errorMessage = error.message;
    }
    // Preserve validation details so forms can associate them with inputs.
    const normalizedError = new Error(errorMessage);
    normalizedError.response = error.response;
    normalizedError.data = error.response?.data;
    return Promise.reject(normalizedError);
  }
);

export default api;
