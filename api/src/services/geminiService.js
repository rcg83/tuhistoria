/* Servicio encargado de la comunicación directa con la API de Google Gemini. */

import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* Función solo para probar que funcione. */
export const testGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};