
import React, { useState, useEffect, useCallback } from 'react';
import { Message } from './types';
import BiboAvatar from './components/BiboAvatar';
import ChatWindow from './components/ChatWindow';
import { createChatSession, sendMessageToBibo } from './services/geminiService';
import type { Chat } from '@google/genai';


const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const biboResponseText = await sendMessageToBibo(chatSession, userInput);
      
      const biboMessage: Message = {
        id: Date.now().toString() + 'b',
        text: biboResponseText,
        sender: 'bibo',
      };
      setMessages((prev) => [...prev, biboMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + 'e',
        text: 'Oh no! I seem to have a little glitch. Can you try that again?',
        sender: 'bibo',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, isLoading, chatSession]);


  return (
    <div className="h-screen w-screen bg-gradient-to-b from-gray-900 via-purple-900/50 to-gray-900 text-white flex flex-col p-2 sm:p-4">
      <header className="flex-shrink-0 py-4">
        <BiboAvatar isLoading={isLoading} />
      </header>
      <main className="flex-1 min-h-0">
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          userInput={userInput}
          setUserInput={setUserInput}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default App;
