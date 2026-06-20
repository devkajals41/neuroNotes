import "./DashboardV2.css";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import ConceptMap from "../components/ConceptMap";
import KnowledgeGraph from "../components/KnowledgeGraph";
import logo from "../assets/logo.png";
import {
  
  FaStickyNote,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState("");

  const [term, setTerm] = useState("");
  const [dictionaryResult, setDictionaryResult] = useState("");

  const [concepts, setConcepts] = useState([]);

  const [graphData, setGraphData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeTab, setActiveTab] =
  useState("summary");


  const [loading, setLoading] =
  useState(false);
  const [selectedNote, setSelectedNote] =
  useState(null);

  const [isEditing, setIsEditing] =
  useState(false);

const [editTitle, setEditTitle] =
  useState("");

const dropdownRef = useRef(null);

const [editContent, setEditContent] =
  useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();

      console.log("Notes:", data);

      setNotes(data.notes);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(
        event.target
      )
    ) {
      setShowMenu(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {
      await createNote({
        title,
        content,
      });

      toast.success(
  "Note created successfully"
);

      setTitle("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleSummary = async (noteContent) => {
  try {

    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/ai/summary",
      {
        content: noteContent,
      },
    );

    setSummary(response.data.summary);

  } catch (error) {
    console.log(
      error.response?.data ||
      error.message
    );

  } finally {

    setLoading(false);

  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  const handleFlashcards = async (noteContent) => {
  try {

    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/ai/flashcards",
      {
        content: noteContent,
      },
    );

    setFlashcards(
      response.data.flashcards
    );

  } catch (error) {
    console.log(
      error.response?.data ||
      error.message
    );

  } finally {

    setLoading(false);

  }
};

const handleDictionary = async () => {
  try {

    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/ai/dictionary",
      {
        term,
      },
    );

    setDictionaryResult(
      response.data.explanation
    );

  } catch (error) {
    console.log(
      error.response?.data ||
      error.message
    );

  } finally {

    setLoading(false);

  }
};

const handleConceptMap = async (noteContent) => {
  try {

    setLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/ai/concepts",
      {
        content: noteContent,
      }
    );

    const cleaned =
      response.data.concepts
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const parsed =
      JSON.parse(cleaned);

    setConcepts(
      parsed.concepts
    );

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};
  
  const handleKnowledgeGraph = async (noteContent) => {
    try {
         setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/ai/knowledge-graph",
        {
          content: noteContent,
        },
      );

      const cleaned = response.data.graph
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      console.log("GRAPH DATA:", parsed);

      console.log("NODES:", parsed.nodes);

      console.log("EDGES:", parsed.edges);

      setGraphData(parsed);
    } catch (error) {
      console.log(error);
    }
     finally {

    setLoading(false);
     }

  };

  const handleDeleteNote = async () => {
  if (!selectedNote) return;

  const confirmDelete =
    window.confirm(
      "Delete this note?"
    );

  if (!confirmDelete) return;

  try {
    await deleteNote(
      selectedNote._id
    );

    toast.success(
  "Note deleted successfully"
);
    setSelectedNote(null);

    fetchNotes();
  } catch (error) {
    console.log(error);
  }
};

const handleUpdateNote =
  async () => {
    try {
      await updateNote(
        selectedNote._id,
        {
          title: editTitle,
          content: editContent,
        }
      );

      toast.success(
  "Note updated successfully"
);

      setIsEditing(false);

      fetchNotes();

      setSelectedNote({
        ...selectedNote,
        title: editTitle,
        content: editContent,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
  <div className="dashboard">
    <div className="sidebar">
     <div className="logo">
  <img
    src={logo}
    alt="NeuroNotes"
    className="logo-img"
  />

  <span>NeuroNotes</span>
</div>


      <input
        className="search-box"
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      <h3
  style={{
    marginTop: "20px",
    marginBottom: "15px"
  }}
>
  Recent Notes
</h3>

      {filteredNotes.map((note) => (
  <div
    key={note._id}
    className={
  selectedNote?._id === note._id
    ? "note-card active"
    : "note-card"
}
    onClick={() => {
      setSelectedNote(note);

      setSummary("");
      setFlashcards("");
      setConcepts([]);
      setGraphData(null);
      setDictionaryResult("");
    }}
  >
    <>
  <FaStickyNote
    style={{ marginRight: "10px" }}
  />
  {note.title}
</>
  </div>
))}
    </div>

   <div className="main">

  <div className="dashboard-header">
    <div>
      <h1>Dashboard</h1>

      <p className="subtitle">
        Manage your notes and AI workspace
      </p>
    </div>
<div
  style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }}
>
  <div
  className="profile-section"
  ref={dropdownRef}
>

  <div
    className="user-avatar"
    onClick={() =>
      setShowMenu(!showMenu)
    }
  >
    K
  </div>

  {showMenu && (

    <div className="profile-dropdown">

      <div className="profile-name">
        Kajal
      </div>

      <button
        className="dropdown-logout"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>

  )}

</div>
</div>

      
    
  </div>


   <div className="welcome-card-v2">
  <h2>
  Welcome back 👋
</h2>

  <p>
    Turn notes into summaries, flashcards,
    concept maps and knowledge graphs with
    AI-powered learning tools.
  </p>
</div>
  <div className="stats-grid">

  <div className="mini-stat stat-purple">
    <h3>Total Notes</h3>
    <span>{notes.length}</span>
  </div>

  <div className="mini-stat stat-cyan">
    <h3>Concept Maps</h3>
    <span>{concepts.length}</span>
  </div>

 <div className="mini-stat stat-pink">
  <h3>Knowledge Graphs</h3>
  <span>{graphData ? 1 : 0}</span>
</div>
</div>
      
      <div className="section">
        <h2>Create Note</h2>

        <form onSubmit={handleCreateNote}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            rows="18"
            placeholder="Write note..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          {selectedNote ? (
  <button
    type="button"
    onClick={handleUpdateNote}
  >
    Update Note
  </button>
) : (
  <button type="submit">
    Create Note
  </button>
)}
        </form>
      </div>
       
    {selectedNote && (
  <>
    <div className="section">

      <div className="note-header">

        <h2>{selectedNote.title}</h2>

        <div className="note-actions">

          <button
            className="edit-btn"
            onClick={() => {
              setIsEditing(true);
              setEditTitle(selectedNote.title);
              setEditContent(selectedNote.content);
            }}
          >
            ✏️ Edit
          </button>

          <button
            className="delete-btn"
            onClick={handleDeleteNote}
          >
            🗑 Delete
          </button>

        </div>

      </div>

      {isEditing ? (

        <div>

          <input
            value={editTitle}
            onChange={(e) =>
              setEditTitle(e.target.value)
            }
          />

          <textarea
            rows="10"
            value={editContent}
            onChange={(e) =>
              setEditContent(e.target.value)
            }
          />

          <button
            onClick={handleUpdateNote}
            style={{ marginTop: "15px" }}
          >
            Save Changes
          </button>

        </div>

      ) : (

        <p>{selectedNote.content}</p>

      )}
      <div className="ai-buttons">

  <button
    className="ai-summary"
    onClick={() => {
      handleSummary(selectedNote.content);
      setActiveTab("summary");
    }}
  >
    🧠 Summary
  </button>

  <button
    className="ai-flash"
    onClick={() => {
      handleFlashcards(selectedNote.content);
      setActiveTab("flashcards");
    }}
  >
    📚 Flashcards
  </button>

  <button
    className="ai-concept"
    onClick={() => {
      handleConceptMap(selectedNote.content);
      setActiveTab("concept");
    }}
  >
    🕸 Concept Map
  </button>

  <button
    className="ai-graph"
    onClick={() => {
      handleKnowledgeGraph(selectedNote.content);
      setActiveTab("graph");
    }}
  >
    🔗 Graph
  </button>

</div>

<div className="dictionary-box">

  <input
    type="text"
    placeholder="Enter a term..."
    value={term}
    onChange={(e) =>
      setTerm(e.target.value)
    }
  />

 <button
  className="explain-btn"
  onClick={() => {
    handleDictionary();
    setActiveTab("dictionary");
  }}
>
   Explain
</button>

</div>

<div className="tabs">

  <button
    className={
      activeTab === "summary"
        ? "tab-btn active"
        : "tab-btn"
    }
    onClick={() =>
      setActiveTab("summary")
    }
  >
    Summary
  </button>

  <button
    className={
      activeTab === "flashcards"
        ? "tab-btn active"
        : "tab-btn"
    }
    onClick={() =>
      setActiveTab("flashcards")
    }
  >
    Flashcards
  </button>

  <button
    className={
      activeTab === "concept"
        ? "tab-btn active"
        : "tab-btn"
    }
    onClick={() =>
      setActiveTab("concept")
    }
  >
    Concept Map
  </button>

  <button
    className={
      activeTab === "graph"
        ? "tab-btn active"
        : "tab-btn"
    }
    onClick={() =>
      setActiveTab("graph")
    }
  >
    Knowledge Graph
  </button>

  <button
    className={
      activeTab === "dictionary"
        ? "tab-btn active"
        : "tab-btn"
    }
    onClick={() =>
      setActiveTab("dictionary")
    }
  >
    Dictionary
  </button>

</div>

      

          <div className="section">

  {loading && (
    <div className="loading-box">
      Generating AI Response...
    </div>
  )}
            {activeTab ===
              "summary" &&
              summary && (
                <>
                  <h2>
                    AI Summary
                  </h2>
                  <p>{summary}</p>
                </>
              )}

            {activeTab ===
              "flashcards" &&
              flashcards && (
                <>
                  <h2>
                    Flashcards
                  </h2>
                  <pre>
                    {flashcards}
                  </pre>
                </>
              )}

              {activeTab ===
  "dictionary" &&
  dictionaryResult && (
    <>
      <h2>
        Dictionary
      </h2>

      <pre>
        {dictionaryResult}
      </pre>
    </>
)}


            {activeTab ===
              "concept" &&
              concepts.length >
                0 && (
                <>
                  <h2>
                    Concept Map
                  </h2>

                  <ConceptMap
                    concepts={
                      concepts
                    }
                  />
                </>
              )}

            {activeTab ===
              "graph" &&
              graphData && (
                <>
                  <h2>
                    Knowledge Graph
                  </h2>

                  <KnowledgeGraph
                    graphData={
                      graphData
                    }
                  />
                </>
              )}
          </div>

</div>

</>
)}
    </div>
  </div>
);
}
export default Dashboard;
