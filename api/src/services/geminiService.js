/* Servicio encargado de la comunicación directa con la API de Google Gemini. */

import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* Función solo para probar que funcione Gemini. */
export const testGemini = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

/* Función para continuar la historia con el contexto de los mensajes (modelos comentados para pruebas). */
export const continueStory = async (history, prompt) => {
  //const model = genAI.getGenerativeModel({model: "gemini-flash-latest"});
  //const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = model.startChat({
    history: history 
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
};