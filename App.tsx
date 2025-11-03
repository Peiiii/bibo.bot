import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Mood } from './types';
import BiboAvatar from './components/BiboAvatar';
import ChatWindow from './components/ChatWindow';
import BiboRoom from './components/BiboRoom';
import { createChatSession, sendMessageToBibo } from './services/geminiService';
import type { Chat } from '@google/genai';

const QuickActionButton: React.FC<{ onClick: () => void; ariaLabel: string; children: React.ReactNode; disabled: boolean }> = ({ onClick, ariaLabel, children, disabled }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="bg-purple-500/20 backdrop-blur-sm text-purple-200 rounded-full p-2.5 hover:bg-purple-500/40 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
    disabled={disabled}
  >
    {children}
  </button>
);

const MoodButton: React.FC<{ emoji: string; newMood: Mood; currentMood: Mood; onClick: (mood: Mood) => void; ariaLabel: string; disabled: boolean }> = ({ emoji, newMood, currentMood, onClick, ariaLabel, disabled }) => (
    <button
        onClick={() => onClick(newMood)}
        aria-label={ariaLabel}
        className={`bg-purple-500/10 backdrop-blur-sm text-xl rounded-full w-10 h-10 flex items-center justify-center hover:bg-purple-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 ${currentMood === newMood ? 'bg-purple-500/40 ring-2 ring-purple-400' : ''}`}
        disabled={disabled}
    >
        {emoji}
    </button>
);


const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biboMood, setBiboMood] = useState<Mood>('Happy');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const biboAvatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([
      {
        id: 'init',
        text: 'Hello! Welcome to my room! What should we talk about today? ✨',
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
      setBiboMood('Sad');
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
  
  const handleSetBiboMood = (newMood: Mood) => {
    if (isLoading) return;
    setBiboMood(newMood);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!biboAvatarRef.current) return;

    const biboRect = biboAvatarRef.current.getBoundingClientRect();
    const centerX = biboRect.left + biboRect.width / 2;
    const centerY = biboRect.top + biboRect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const interactionRadius = biboRect.width * 2;

    const moveX = Math.max(-1, Math.min(1, deltaX / interactionRadius));
    const moveY = Math.max(-1, Math.min(1, deltaY / interactionRadius));

    const maxPupilOffset = 4.5;
    setPupilOffset({
      x: moveX * maxPupilOffset,
      y: moveY * maxPupilOffset,
    });

    const maxTilt = 10; // degrees
    setHeadTilt(moveX * maxTilt * -1); // Invert for natural tilt
  };

  const handleMouseLeave = () => {
    setPupilOffset({ x: 0, y: 0 });
    setHeadTilt(0);
  };

  const getRoomStyle = (mood: Mood): React.CSSProperties => {
    switch (mood) {
        case 'Happy':
        case 'Love':
        case 'Silly':
            return { '--light-color': '#fef08a', '--ambience-opacity': 0.6 };
        case 'Sad':
            return { '--light-color': '#a5b4fc', '--ambience-opacity': 0.15 };
        case 'Curious':
            return { '--light-color': '#bae6fd', '--ambience-opacity': 0.4 };
        case 'Cool':
             return { '--light-color': '#d946ef', '--ambience-opacity': 0.5 };
        default:
            return { '--light-color': '#fafafa', '--ambience-opacity': 0.3 };
    }
  };


  return (
    <div className="h-screen w-screen bg-gray-900 text-white relative flex flex-col overflow-hidden" style={getRoomStyle(biboMood)}>
        <div 
            className="flex-1 relative w-full flex items-center justify-center flex-col"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <BiboRoom />
            <div className="relative text-center">
                <BiboAvatar 
                  ref={biboAvatarRef}
                  isLoading={isLoading} 
                  mood={biboMood}
                  onMoodChange={handleSetBiboMood}
                  pupilOffset={pupilOffset}
                  headTilt={headTilt}
                />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider mt-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>bibo.bot</h1>
                <p className="text-purple-300" style={{textShadow: '0 1px 5px rgba(0,0,0,0.5)'}}>Your friendly AI companion</p>
            </div>
        </div>

        <main className="flex-shrink-0 w-full max-h-[50vh] flex flex-col z-20">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-y-3 px-2 sm:px-4">
                 <div className="flex items-center space-x-3">
                    <QuickActionButton onClick={() => handleQuickAction("Tell me a funny joke! 🤣")} ariaLabel="Tell a joke" disabled={isLoading}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.75.75 0 01.083-1.05l-.001-.001.001-.001a4.5 4.5 0 00-6.236 0l.001.001-.001.001a.75.75 0 01-1.05-.083l-.001-.001a.75.75 0 01.083-1.05l.001.001a6 6 0 118.485 0l.001-.001a.75.75 0 01.083 1.05l-.001.001z" clipRule="evenodd" />
                      </svg>
                    </QuickActionButton>
                    <QuickActionButton onClick={() => handleQuickAction("Ask me a really curious question! 🤔")} ariaLabel="Ask a question" disabled={isLoading}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 114.95 4.95l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a1.5 1.5 0 00-2.122-2.122L8.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </QuickActionButton>
                 </div>
                 <div className="grid grid-cols-9 gap-2 w-full max-w-sm">
                    <MoodButton emoji="🙂" newMood="Neutral" ariaLabel="Set mood to Neutral" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😄" newMood="Happy" ariaLabel="Set mood to Happy" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="🤔" newMood="Curious" ariaLabel="Set mood to Curious" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😢" newMood="Sad" ariaLabel="Set mood to Sad" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😮" newMood="Surprised" ariaLabel="Set mood to Surprised" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😉" newMood="Wink" ariaLabel="Set mood to Wink" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😍" newMood="Love" ariaLabel="Set mood to Love" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😜" newMood="Silly" ariaLabel="Set mood to Silly" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                    <MoodButton emoji="😎" newMood="Cool" ariaLabel="Set mood to Cool" onClick={handleSetBiboMood} currentMood={biboMood} disabled={isLoading} />
                 </div>
             </div>
            <div className="flex-1 w-full min-h-0 pt-3">
                <ChatWindow 
                  messages={messages}
                  isLoading={isLoading}
                  userInput={userInput}
                  setUserInput={setUserInput}
                  onSendMessage={handleFormSubmit}
                />
            </div>
        </main>
    </div>
  );
};

export default App;
