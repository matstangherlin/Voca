import { GoogleGenAI, Type } from "@google/genai";
import { Word } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWordOfTheDay(): Promise<Word> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Gere uma palavra interessante da língua portuguesa para um aplicativo de expansão de vocabulário. Escolha algo erudito, literário ou científico, mas que seja útil ou fascinante.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          meaning: { type: Type.STRING },
          etymology: { type: Type.STRING },
          examples: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3 a 5 frases de exemplo de uso real."
          },
          category: { 
            type: Type.STRING, 
            enum: ["literário", "científico", "cotidiano", "arcaico", "expressão"] 
          }
        },
        required: ["word", "meaning", "etymology", "examples", "category"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: data.word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    addedDate: new Date().toISOString()
  };
}

export async function generateWordByCategory(category: string): Promise<Word> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere uma palavra da categoria "${category}" em português.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          meaning: { type: Type.STRING },
          etymology: { type: Type.STRING },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          category: { type: Type.STRING }
        },
        required: ["word", "meaning", "etymology", "examples", "category"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: data.word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    addedDate: new Date().toISOString()
  };
}
