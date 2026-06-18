import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

// Get all notes
export const createNote = async (noteData) => {

  const token = localStorage.getItem("token");

  const response = await axios.post(
    API_URL,
    noteData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};