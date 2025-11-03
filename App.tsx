import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Mood, Location, LocationId } from './types';
import BiboAvatar from './components/BiboAvatar';
import ChatWindow from './components/ChatWindow';
import BiboRoom from './components/BiboRoom';
import WhisperingWoods from './components/WhisperingWoods';
import CrystalCaves from './components/CrystalCaves';
import WorldView from './components/WorldView';
import { createChatSession, sendMessageToBibo } from './services/geminiService';
import type { Chat } from '@google/genai';

const locations: Location[] = [
    { id: 'home', name: "Bibo's Room", coords: { x: '50%', y: '40%' } },
    { id: 'woods', name: 'Whispering Woods', coords: { x: '25%', y: '65%' } },
    { id: 'caves', name: 'Crystal Caves', coords: { x: '78%', y: '70%' } },
];

const App: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [biboMood, setBiboMood] = useState<Mood>('Happy');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [currentLocationId, setCurrentLocationId] = useState<LocationId>('home');
  const [leftPanelView, setLeftPanelView] = useState<'world' | 'room'>('world');
  
  const biboSceneRef = useRef<HTMLDivElement>(null);
  const movementIntervalRef = useRef<number | null>(null);

  // Initialize chat session and welcome message
  useEffect(() => {
    const session = createChatSession();
    setChatSession(session);
    setMessages([
      {
        id: 'init',
        text: 'Hello! Welcome to my little island! You can see where I am on the map. Click a location to visit me there! ✨',
        sender: 'bibo',
      },
    ]);
  }, []);

  // Autonomous movement for Bibo
  useEffect(() => {
    const moveBibo = () => {
      const otherLocations = locations.filter(l => l.id !== currentLocationId);
      const nextLocation = otherLocations[Math.floor(Math.random() * otherLocations.length)];
      setCurrentLocationId(nextLocation.id);
    };

    movementIntervalRef.current = window.setInterval(moveBibo, 30000); // Move every 30 seconds

    return () => {
        if (movementIntervalRef.current) {
            clearInterval(movementIntervalRef.current);
        }
    };
  }, [currentLocationId]);

  const handleLocationClick = (locationId: LocationId) => {
    setCurrentLocationId(locationId);
    setLeftPanelView('room'); // Switch to room view on travel
    // Reset the autonomous movement timer to prevent immediate double-jumps
    if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
    }
    const moveBibo = () => {
      const otherLocations = locations.filter(l => l.id !== locationId);
      const nextLocation = otherLocations[Math.floor(Math.random() * otherLocations.length)];
      setCurrentLocationId(nextLocation.id);
    };
    movementIntervalRef.current = window.setInterval(moveBibo, 30000);
  };
  
  const handleShowWorldView = () => {
    setLeftPanelView('world');
  };

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
      const currentLocationName = locations.find(l => l.id === currentLocationId)?.name || 'a mysterious place';
      const biboResponse = await sendMessageToBibo(chatSession, messageToSend, currentLocationName);
      
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
  }, [userInput, isLoading, chatSession, currentLocationId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!biboSceneRef.current) return;

    const biboRect = biboSceneRef.current.getBoundingClientRect();
    const centerX = biboRect.left + biboRect.width / 2;
    const centerY = biboRect.top + biboRect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const maxPupilOffset = 4.5;
    const moveX = Math.max(-1, Math.min(1, deltaX / (biboRect.width)));
    const moveY = Math.max(-1, Math.min(1, deltaY / (biboRect.height)));

    setPupilOffset({
      x: moveX * maxPupilOffset,
      y: moveY * maxPupilOffset,
    });

    const maxTilt = 10;
    setHeadTilt(moveX * maxTilt * -1);
  };

  const handleMouseLeave = () => {
    setPupilOffset({ x: 0, y: 0 });
    setHeadTilt(0);
  };

  const getRoomStyle = (mood: Mood): React.CSSProperties => {
    switch (mood) {
        case 'Happy': case 'Love': case 'Silly':
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
  
  const renderCurrentScene = () => {
    switch (currentLocationId) {
      case 'home':
        return <BiboRoom />;
      case 'woods':
        return <WhisperingWoods />;
      case 'caves':
        return <CrystalCaves />;
      default:
        return <BiboRoom />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex overflow-hidden">
      {/* Left Panel: World and Bibo's Scene */}
      <div className="w-1/2 h-full flex flex-col p-4 gap-4">
        {leftPanelView === 'world' ? (
          <div className="w-full h-full bg-gray-900/40 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-purple-500/20 flex flex-col">
              <h2 className="text-xl font-bold text-purple-200 mb-2 flex-shrink-0">Bibo's World</h2>
              <div className="flex-grow min-h-0">
                <WorldView 
                    locations={locations} 
                    currentLocationId={currentLocationId} 
                    onLocationClick={handleLocationClick} 
                />
              </div>
          </div>
        ) : (
          <div 
              className="flex-1 relative w-full flex items-center justify-center flex-col bg-gray-900/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20"
              style={getRoomStyle(biboMood)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={biboSceneRef}
          >
              <button onClick={handleShowWorldView} className="absolute top-4 left-4 z-20 bg-purple-600/50 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-500 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v12a1 1 0 00.293.707l6 6a1 1 0 001.414 0l6-6A1 1 0 0016 16V4a1 1 0 00-.293-.707l-6-6a1 1 0 00-1.414 0l-6 6z" clipRule="evenodd" />
                </svg>
                World Map
              </button>
              {renderCurrentScene()}
              <div className="relative text-center">
                  <BiboAvatar 
                    isLoading={isLoading} 
                    mood={biboMood}
                    onMoodChange={setBiboMood}
                    pupilOffset={pupilOffset}
                    headTilt={headTilt}
                  />
              </div>
          </div>
        )}
      </div>

      {/* Right Panel: Chat */}
      <main className="w-1/2 h-full flex flex-col p-4 pl-0">
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
