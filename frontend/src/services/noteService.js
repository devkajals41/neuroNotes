import axios from "axios";

// ==========================================
// API CONFIGURATION FOR LOCAL VS PRODUCTION
// ==========================================
// To run locally on your PC:
// Uncomment the LOCAL URL and comment the PRODUCTION URL.
// ==========================================
// const API_URL = "http://localhost:5000/api/notes"; // LOCAL URL
const API_URL = "https://neuronotes-backend-afri.onrender.com/api/notes"; // PRODUCTION URL

// Get all notes
export const getNotes = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Create note
export const createNote = async (noteData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update note
export const updateNote = async (id, noteData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete note
export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
