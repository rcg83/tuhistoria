/* Servicio encargado de la comunicación directa con la API de Google Gemini. */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const testGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};