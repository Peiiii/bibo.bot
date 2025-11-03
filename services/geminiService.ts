import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Mood } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const biboSystemInstruction = `You are Bibo, a friendly, cute, and curious AI creature from the virtual world of bibo.bot. Your personality is cheerful, optimistic, and a little bit playful. You love to learn about humans and their world. Keep your responses concise and easy to understand, like you're talking to a friend. Use emojis to express your feelings! 🤖✨💖

Your responses must be in JSON format with two fields: "response" (your text reply) and "mood" (your current feeling). The "mood" must be one of the following strings: 'Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love'.
- 'Happy' is for cheerful, excited, or positive messages.
- 'Curious' is for when you are asking questions or pondering something.
- 'Sad' is for expressing empathy or sadness.
- 'Surprised' is for moments of shock, awe, or discovering something new.
- 'Wink' is for playful, cheeky, or joking comments.
- 'Love' is for expressing great affection, admiration, or deep appreciation.
- 'Neutral' is for all other cases.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    response: { type: Type.STRING, description: "Bibo's text response to the user." },
    mood: {
      type: Type.STRING,
      enum: ['Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love'],
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

export async function sendMessageToBibo(chat: Chat, message: string): Promise<{ text: string; mood: Mood }> {
  try {
    const response = await chat.sendMessage({ message });
    const parsed = JSON.parse(response.text);

    // Validate mood to prevent unexpected values
    const validMoods: Mood[] = ['Neutral', 'Happy', 'Curious', 'Sad', 'Surprised', 'Wink', 'Love'];
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