import express from "express";
import {
  summarizeNote,
  flashcards,
  dictionary,
  concepts,
  knowledgeGraph,
} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summary", protect, summarizeNote);

router.post("/flashcards", protect, flashcards);

router.post("/dictionary", protect, dictionary);

router.post("/concepts", protect, concepts);

router.post("/knowledge-graph", protect, knowledgeGraph);

export default router;
