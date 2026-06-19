import express from "express";
import {
  summarizeNote,
  flashcards,
  dictionary,
  concepts,
  knowledgeGraph,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/summary", summarizeNote);

router.post("/flashcards", flashcards);

router.post("/dictionary", dictionary);

router.post("/concepts", concepts);

router.post("/knowledge-graph", knowledgeGraph);

export default router;
