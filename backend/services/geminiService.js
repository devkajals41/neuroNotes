import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });
  const prompt = `
  Summarize the following note in 3-5 concise sentences:

  ${noteContent}
  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

export const generateFlashcards = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Create 5 study flashcards from the following note.

Format:

Q: Question
A: Answer

Note:
${noteContent}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

export const explainTerm = async (term) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Explain this term in a student-friendly way.

Term: ${term}

Return:
Definition:
Example:
Related Concepts:
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

export const extractConcepts = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Extract the most important concepts
from this note.

Return ONLY JSON.

Example:

{
  "concepts": [
    "React",
    "Hooks",
    "useState"
  ]
}

Note:
${noteContent}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};
