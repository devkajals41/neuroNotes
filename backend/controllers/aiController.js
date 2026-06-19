import {
  generateSummary,
  generateFlashcards,
  explainTerm,
  extractConcepts,
} from "../services/geminiService.js";

export const summarizeNote = async (
  req,
  res
) => {
  try {

    const { content } = req.body;

    const summary =
      await generateSummary(content);

    res.status(200).json({
      success: true,
      summary,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const flashcards = async (
  req,
  res
) => {
  try {

    const { content } = req.body;

    const cards =
      await generateFlashcards(content);

    res.status(200).json({
      success: true,
      flashcards: cards,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const dictionary = async (
  req,
  res
) => {
  try {

    const { term } = req.body;

    const explanation =
      await explainTerm(term);

    res.status(200).json({
      success: true,
      explanation,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const concepts = async (
  req,
  res
) => {
  try {

    const { content } = req.body;

    const result =
      await extractConcepts(content);

    res.status(200).json({
      success: true,
      concepts: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};