import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Mood } from './types';
import BiboAvatar from './components/BiboAvatar';
import ChatWindow from './components/ChatWindow';
import { createChatSession, sendMessageToBibo } from './services/geminiService';
import type { Chat } from '@google/genai';


const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biboMood, setBiboMood] = useState<Mood>('Happy');
  const moodTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([
      {
        id: 'init',
        text: 'Hello! My name is Bibo. What should we talk about today? ✨',
        sender: 'bibo',
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const messageToSend = (messageText || userInput).trim();
    if (!messageToSend || isLoading || !chatSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) {
      setUserInput('');
    }
    setIsLoading(true);

    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }

    try {
      const biboResponse = await sendMessageToBibo(chatSession, messageToSend);
      
      const biboMessage: Message = {
        id: Date.now().toString() + 'b',
        text: biboResponse.text,
        sender: 'bibo',
      };
      setMessages((prev) => [...prev, biboMessage]);
      setBiboMood(biboResponse.mood);

    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + 'e',
        text: 'Oh no! I seem to have a little glitch. Can you try that again?',
        sender: 'bibo',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setBiboMood('Neutral');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, chatSession]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  const handlePatBibo = () => {
    if(isLoading) return;
    
    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }
    setBiboMood('Happy');
    moodTimeoutRef.current = window.setTimeout(() => {
      setBiboMood('Neutral');
    }, 2500);
  };


  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-gray-900 text-white flex flex-col p-2 sm:p-4">
      <header className="flex-shrink-0 py-4">
        <BiboAvatar 
          isLoading={isLoading} 
          mood={biboMood}
          onQuickAction={handleQuickAction}
          onPat={handlePatBibo}
        />
      </header>
      <main className="flex-1 min-h-0">
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          userInput={userInput}
          setUserInput={setUserInput}
          onSendMessage={handleFormSubmit}
        />
      </main>
    </div>
  );
};

export default App;