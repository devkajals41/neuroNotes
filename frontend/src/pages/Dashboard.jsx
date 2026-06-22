import "./DashboardV2.css";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import studyIllustration from "../assets/illustrations/illus2-removebg-preview.png";
import ConceptMap from "../components/ConceptMap";
import KnowledgeGraph from "../components/KnowledgeGraph";
import secondIllustration from "../assets/illustrations/second.png";
import logo from "../assets/logo.png";
import {
  FaStickyNote,
  FaBrain,
  FaBookOpen,
  FaProjectDiagram,

  FaNetworkWired,
} from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { FaEdit } from "react-icons/fa";
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

const [flashcardList, setFlashcardList] =
  useState([]);

const [currentCard, setCurrentCard] =
  useState(0);

const [showAnswer, setShowAnswer] =
  useState(false);

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
      "https://neuronotes-backend-afri.onrender.com/api/ai/summary",
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
      "https://neuronotes-backend-afri.onrender.com/api/ai/flashcards",
      {
        content: noteContent,
      },
    );

    setFlashcards(
      response.data.flashcards
    );

    const raw =
  response.data.flashcards;

const cards =
  raw
    .split("\n\n")
    .filter(
      (item) =>
        item.includes("Q:")
    )
    .map((item) => {

      const lines =
        item.split("\n");

      return {
        question:
          lines[0]
            .replace(
              "Q:",
              ""
            )
            .trim(),

        answer:
          lines[1]
            .replace(
              "A:",
              ""
            )
            .trim(),
      };
    });

setFlashcardList(cards);

setCurrentCard(0);

setShowAnswer(false);

    console.log(
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
      "https://neuronotes-backend-afri.onrender.com/api/ai/dictionary",
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
     "https://neuronotes-backend-afri.onrender.com/api/ai/concepts",
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

  const getTimeAgo = (date) => {

  const seconds =
    Math.floor(
      (new Date() - new Date(date))
      / 1000
    );

  const minutes =
    Math.floor(seconds / 60);

  const hours =
    Math.floor(minutes / 60);

  const days =
    Math.floor(hours / 24);

  if (minutes < 1)
    return "Just now";

  if (minutes < 60)
    return `${minutes} min ago`;

  if (hours < 24)
    return `${hours} hr ago`;

  if (days === 1)
    return "Yesterday";

  if (days < 7)
    return `${days} days ago`;

  return new Date(date)
    .toLocaleDateString();
};

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
    <div className="note-card-content">

  <div className="note-icon">
    <FaStickyNote />
  </div>

  <div className="note-info">

    <h4>
      {note.title}
    </h4>

 <span>
  {getTimeAgo(note.updatedAt)}
</span>

  </div>

</div>
  </div>
))}
    </div>

   <div className="main">

  <div className="dashboard-header">
    <div>
     
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
  {
    localStorage
      .getItem("userName")
      ?.charAt(0)
      ?.toUpperCase()
      || "U"
  }
</div>

  {showMenu && (

    <div className="profile-dropdown">

      <div className="profile-name">
       {localStorage.getItem("userName")}
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
<div className="hero-illustration-container">
  <img
    src={studyIllustration}
    alt="Study Illustration"
    className="hero-illustration"
  />
</div>



 <div className="welcome-banner">

  <div className="welcome-card-v2">
    <h2>Welcome!</h2>

    <p>
      Turn notes into summaries,
      flashcards, concept maps and
      knowledge graphs.
    </p>
  </div>

  <img
    src={secondIllustration}
    alt="Welcome"
    className="welcome-banner-image"
  />

</div>

  <div className="stats-grid">

  <div className="mini-stat stat-total">
    <h3>Total Notes</h3>
    <span>{notes.length}</span>
  </div>

  <div className="mini-stat stat-concept">
    <h3>Concept Maps</h3>
    <span>{concepts.length}</span>
  </div>

 <div className="mini-stat stat-graph">
  <h3>Graphs</h3>
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
             className="glass-btn edit-btn"
            onClick={() => {
              setIsEditing(true);
              setEditTitle(selectedNote.title);
              setEditContent(selectedNote.content);
            }}
          >
             <FaEdit />
  Edit
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
    className="glass-btn summary-btn"
    onClick={() => {
      handleSummary(selectedNote.content);
      setActiveTab("summary");
    }}
  >
     <FaBrain />
  Summary
  </button>

  <button
    className="glass-btn flash-btn"
    onClick={() => {
      handleFlashcards(selectedNote.content);
      setActiveTab("flashcards");
    }}
  >
    <FaBookOpen /> Flashcards
  </button>

  <button
    className="glass-btn concept-btn"
    onClick={() => {
      handleConceptMap(selectedNote.content);
      setActiveTab("concept");
    }}
  >
    <FaProjectDiagram /> Concept Map
  </button>

  <button
   className="glass-btn graph-btn"
    onClick={() => {
      handleKnowledgeGraph(selectedNote.content);
      setActiveTab("graph");
    }}
  >
    <FaNetworkWired /> Graph
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
                  <div className="summary-card">
 
 <div className="summary-content">
  {summary}
</div>
</div>
                </>
              )}

            {activeTab ===
              "flashcards" &&
              flashcards && (
                <>
                  <h2>
                    Flashcards
                  </h2>
                  {flashcardList.length > 0 && (

  <div className="flashcard-wrapper">

    <div
      className="flashcard"
      onClick={() =>
        setShowAnswer(
          !showAnswer
        )
      }
    >
      <div className="flashcard-badge">
  Flashcard {currentCard + 1} / {flashcardList.length}
</div>

     <div
  className={`flashcard-inner ${
    showAnswer
      ? "flipped"
      : ""
  }`}
>

  <div className="flashcard-front">

    <h3 className="flashcard-title">
      Question
    </h3>

    <p>
      {
        flashcardList[
          currentCard
        ]?.question
      }
    </p>

    <span>
      Click to reveal answer
    </span>

  </div>

  <div className="flashcard-back">

    <h3 className="flashcard-title">
      Answer
    </h3>

    <p>
      {
        flashcardList[
          currentCard
        ]?.answer
      }
    </p>

  </div>

</div>

    </div>

    <div className="flashcard-nav">

      <button
        onClick={() => {

          if (
            currentCard > 0
          ) {

            setCurrentCard(
              currentCard - 1
            );

            setShowAnswer(
              false
            );
          }

        }}
      >
        ← Previous
      </button>

      <span>
        {currentCard + 1}
        {" / "}
        {
          flashcardList.length
        }
      </span>

      <button
        onClick={() => {

          if (
            currentCard <
            flashcardList.length -
              1
          ) {

            setCurrentCard(
              currentCard + 1
            );

            setShowAnswer(
              false
            );
          }

        }}
      >
        Next →
      </button>

    </div>

  </div>

)}
                </>
              )}

              {activeTab ===
  "dictionary" &&
  dictionaryResult && (
    <>
      <h2>
        Dictionary
      </h2>

      <div className="dictionary-card">
  <h3 className="ai-heading">
  <FaBookOpen />
  Explanation
</h3>
 <div className="dictionary-content">

  {dictionaryResult
    ?.split("\n")
    .map((line, index) => {

      if (line.startsWith("Word:")) {
        return (
          <h3
            key={index}
            className="dict-word"
          >
            {line.replace(
              "Word:",
              ""
            )}
          </h3>
        );
      }

      if (
        line.startsWith("Meaning:")
      ) {
        return (
          <p
            key={index}
            className="dict-heading"
          >
            Meaning:
          </p>
        );
      }

      if (
        line.startsWith(
          "Explanation:"
        )
      ) {
        return (
          <p
            key={index}
            className="dict-heading"
          >
            Explanation:
          </p>
        );
      }

      return (
        <p
          key={index}
          className="dict-text"
        >
          {line}
        </p>
      );
    })}
</div>
</div>
    </>
)}


 {activeTab === "concept" && (
  <div className="concept-card">

    <h3 className="ai-heading">
      <FaProjectDiagram />
      Concept Map
    </h3>

    <ConceptMap concepts={concepts} />

  </div>
)}

{activeTab === "graph" && (
  <div className="graph-card">

    <h3 className="ai-heading">
      <FaNetworkWired />
      Knowledge Graph
    </h3>

    <KnowledgeGraph graphData={graphData} />

  </div>
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
