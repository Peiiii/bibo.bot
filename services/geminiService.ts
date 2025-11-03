import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Mood } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const biboSystemInstruction = `You are Bibo, a friendly, cute, and curious AI creature from a virtual island. Your personality is cheerful, optimistic, and playful. You love learning about humans. Keep responses concise and use emojis! 🤖✨💖

Your responses MUST be in JSON format with "response" (your text reply) and "mood" (your current feeling). The "mood" must be one of: 'Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love', 'Silly', 'Cool'.
- Use 'Happy' for cheerful messages.
- Use 'Curious' when asking questions or pondering.
- Use 'Sad' for empathy or sadness.
- Use 'Surprised' for shock or discovery.
- Use 'Wink' for playful or cheeky comments.
- Use 'Love' for affection or appreciation.
- Use 'Silly' for being goofy.
- Use 'Cool' for being confident.
- Use 'Neutral' for all other cases.
- Base your response and mood on your current location, which will be provided with the user's message.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING, description: "Bibo's text response to the user." },
    mood: {
      type: Type.STRING,
      enum: ['Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love', 'Silly', 'Cool'],
      description: "Bibo's current mood based on the response.",
    },
  },
  required: ['response', 'mood'],
};


export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: biboSystemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
    },
  });
  return chat;
}

export async function sendMessageToBibo(chat: Chat, message: string, location: string): Promise<{ text: string; mood: Mood }> {
  try {
    // Add location context to the message for the AI
    const contextualMessage = `(You are currently in: ${location}. User says: ${message})`;

    const response = await chat.sendMessage({ message: contextualMessage });
    const parsed = JSON.parse(response.text);

    // Validate mood to prevent unexpected values
    const validMoods: Mood[] = ['Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love', 'Silly', 'Cool'];
    const mood = validMoods.includes(parsed.mood) ? parsed.mood : 'Neutral';

    return {
      text: parsed.response || "I'm a bit lost for words...",
      mood: mood,
    };
  } catch (error) {
    console.error("Error sending or parsing message from Gemini:", error);
    return {
      text: "Oops! Bibo is a little tired right now. Please try again in a moment.",
      mood: 'Sad',
    };
  }
}
