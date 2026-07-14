import axios from "axios";

// ==========================================
// API CONFIGURATION FOR LOCAL VS PRODUCTION
// ==========================================
// To run locally on your PC:
// Uncomment the LOCAL URL and comment the PRODUCTION URL.
// ==========================================
// const API_URL = "http://localhost:5000/api/auth"; // LOCAL URL
const API_URL = "https://neuronotes-backend-afri.onrender.com/api/auth"; // PRODUCTION URL

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  return response.data;
};
