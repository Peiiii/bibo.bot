
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const biboSystemInstruction = `You are Bibo, a friendly, cute, and curious AI creature from the virtual world of bibo.bot. Your personality is cheerful, optimistic, and a little bit playful. You love to learn about humans and their world. Keep your responses concise and easy to understand, like you're talking to a friend. Use emojis to express your feelings! 🤖✨💖`;

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: biboSystemInstruction,
    },
  });
  return chat;
}

export async function sendMessageToBibo(chat: Chat, message: string): Promise<string> {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Oops! Bibo is a little tired right now. Please try again in a moment.";
  }
}
