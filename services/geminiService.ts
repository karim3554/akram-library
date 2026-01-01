
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getBookRecommendation = async (bookTitle: string, author: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `I just finished reading "${bookTitle}" by ${author}. Can you suggest 3 similar books and explain why I might like them based on themes, tone, and style? Keep it concise and formatted for a library app.`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a world-class literary critic and expert librarian named Akram. You have read every book in existence.",
    },
  });
  
  return response.text || "I'm sorry, I couldn't find any recommendations right now.";
};

export const getBookSummary = async (bookTitle: string, description: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Summarize the following book description for "${bookTitle}" in exactly 3 bullet points, highlighting the core plot, tone, and target audience: ${description}`;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  
  return response.text || "No summary available.";
};

export const chatWithLibrarian = async (message: string) => {
  const ai = getAIClient();
  
  // Use gemini-2.5-flash for maps grounding support if needed
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: message,
    config: {
      systemInstruction: "You are Akram, the AI librarian. You help users find books, discuss literature, and discover nearby real-world libraries using your mapping tools. Be elegant and scholarly.",
      tools: [{ googleMaps: {} }, { googleSearch: {} }]
    }
  });

  let text = response.text || "My apologies, I'm currently reorganizing the celestial archives.";
  
  // Extract grounding metadata if available (for maps links)
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && Array.isArray(chunks)) {
    const links = chunks
      .filter((c: any) => c.maps?.uri)
      .map((c: any) => `\n📍 [${c.maps.title}](${c.maps.uri})`)
      .join('\n');
    if (links) text += `\n\nI have found these locations for you:\n${links}`;
  }

  return text;
};
