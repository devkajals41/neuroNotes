import { useEffect, useState } from "react";
import axios from "axios";
import { getNotes, createNote } from "../services/noteService";
import ConceptMap from "../components/ConceptMap";
import KnowledgeGraph from "../components/KnowledgeGraph";

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
    <div>
      <h1>Dashboard</h1>
      <h2>Create Note</h2>
      <form onSubmit={handleCreateNote}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Create Note</button>
      </form>
      <hr />
      <h2>AI Dictionary</h2>
      <input
        type="text"
        placeholder="Enter a term"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />{" "}
      <button onClick={handleDictionary}>Explain</button>
      <hr />
      <h2>Your Notes</h2>
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <br />
      {filteredNotes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        filteredNotes.map((note) => (
          <div key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleSummary(note.content)}>
              Generate Summary
            </button>{" "}
            <button onClick={() => handleFlashcards(note.content)}>
              Generate Flashcards
            </button>{" "}
            <button onClick={() => handleConceptMap(note.content)}>
              Generate Concept Map
            </button>{" "}
            <button onClick={() => handleKnowledgeGraph(note.content)}>
              Generate Knowledge Graph
            </button>
            <hr />
          </div>
        ))
      )}
      {summary && (
        <div>
          <h2>AI Summary</h2>

          <p>{summary}</p>
        </div>
      )}
      {flashcards && (
        <div>
          <h2>Flashcards</h2>

          <pre>{flashcards}</pre>
        </div>
      )}
      {dictionaryResult && (
        <div>
          <h2>Dictionary Result</h2>

          <pre>{dictionaryResult}</pre>
        </div>
      )}
      <hr />
      <h2>Concept Map</h2>
      <ConceptMap concepts={concepts} />
      <hr />
      <h2>Knowledge Graph</h2>
      <KnowledgeGraph graphData={graphData} />
    </div>
  );
}

export default Dashboard;
