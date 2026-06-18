import { useEffect, useState } from "react";
import { getNotes } from "../services/noteService";

function Dashboard() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();

        console.log("Notes:", data);

        setNotes(data.notes);
      } catch (error) {
        console.log(
          error.response?.data || error.message
        );
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Your Notes</h2>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;