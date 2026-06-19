import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getNotes, createNote } from "../services/noteService";
import ConceptMap from "../components/ConceptMap";
import KnowledgeGraph from "../components/KnowledgeGraph";
import {
  FaBrain,
  FaStickyNote,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
  const [notes, setNotes] = useState([]);
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

  const [selectedNote, setSelectedNote] =
  useState(null);

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

  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {
      await createNote({
        title,
        content,
      });

      setTitle("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleSummary = async (noteContent) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/summary",
        {
          content: noteContent,
        },
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleFlashcards = async (noteContent) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/flashcards",
        {
          content: noteContent,
        },
      );

      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleDictionary = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/dictionary",
        {
          term,
        },
      );

      setDictionaryResult(response.data.explanation);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleConceptMap = async (noteContent) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/concepts",
        {
          content: noteContent,
        },
      );

      const cleaned = response.data.concepts
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      setConcepts(parsed.concepts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKnowledgeGraph = async (noteContent) => {
    try {
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
  <FaBrain /> NeuroNotes
</div>

<button
  style={{
    width: "100%",
    marginTop: "15px",
    background: "#ef4444",
  }}
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }}
>
  Logout
</button>

      <input
        className="search-box"
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      <h3 style={{ marginTop: "20px" }}>
        Notes
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
    <FaStickyNote /> {note.title}
  </div>
))}
    </div>

    <div className="main">

  <div className="topbar">

    <div>
      <h1>AI Learning Workspace</h1>
      <p className="subtitle">
        Learn smarter with AI-powered notes
      </p>
    </div>

    <button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
>
  <FaSignOutAlt />
  {" "}
  Logout
</button>
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

          <button type="submit">
            Create Note
          </button>
        </form>
      </div>
       {!selectedNote && (
  <div className="section">
    <h2>Select a Note</h2>

    <p>
      Choose a note from the sidebar to
      generate summaries, flashcards,
      concept maps, and knowledge graphs.
    </p>
  </div>
)}
      {selectedNote && (
        <>
          <div className="section">
            <h2>
              {selectedNote.title}
            </h2>

            <p>
              {selectedNote.content}
            </p>

            <div className="ai-buttons">
              <button
                onClick={() => {
                  handleSummary(
                    selectedNote.content
                  );
                  setActiveTab(
                    "summary"
                  );
                }}
              >
                Generate Summary
              </button>

              <button
                onClick={() => {
                  handleFlashcards(
                    selectedNote.content
                  );
                  setActiveTab(
                    "flashcards"
                  );
                }}
              >
                Generate Flashcards
              </button>

              <button
                onClick={() => {
                  handleConceptMap(
                    selectedNote.content
                  );
                  setActiveTab(
                    "concept"
                  );
                }}
              >
                Generate Concept Map
              </button>

              <button
                onClick={() => {
                  handleKnowledgeGraph(
                    selectedNote.content
                  );
                  setActiveTab(
                    "graph"
                  );
                }}
              >
                Generate Knowledge Graph
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
          </div>

          <div className="section">
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
        </>
      )}
    </div>
  </div>
);
}
export default Dashboard;
