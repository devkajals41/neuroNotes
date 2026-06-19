import express from "express";
import {
  summarizeNote,
  flashcards,
  dictionary,
  concepts,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/summary",
  summarizeNote
);

router.post(
  "/flashcards",
  flashcards
);

router.post(
  "/dictionary",
  dictionary
);

router.post(
  "/concepts",
  concepts
);
export default router;