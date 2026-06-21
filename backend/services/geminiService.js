import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Summarize this note for quick revision.

Rules:

- Return exactly 5 important points.
- Each point must start with •
- Put EVERY point on a NEW LINE.
- Do NOT put multiple points on the same line.
- Do NOT write paragraphs.
- Do NOT write headings.
- Keep each point short.

Example:

• Point one

• Point two

• Point three

Note:
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
Give a dictionary entry.

Format exactly:

Word: Inheritance

Meaning:
Receiving traits or property from a predecessor.

Explanation:
It refers to the process of passing down characteristics, genes, or assets from one generation to the next.

Rules:
- Meaning = one short line.
- Explanation = one sentence.
- No markdown.
- No JSON.
- No bullet points.

Term:
${term}
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

export const generateKnowledgeGraph = async (noteContent) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const prompt = `
Analyze the note and return ONLY JSON.

Format:

{
  "nodes": [
    "React",
    "Hooks",
    "useState"
  ],
  "edges": [
    {
      "source": "React",
      "target": "Hooks",
      "label": "uses"
    },
    {
      "source": "Hooks",
      "target": "useState",
      "label": "contains"
    }
  ]
}

Note:
${noteContent}
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};
