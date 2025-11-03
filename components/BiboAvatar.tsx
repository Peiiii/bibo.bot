import React from 'react';
import { Mood } from '../types';

interface BiboAvatarProps {
  isLoading: boolean;
  mood: Mood;
  onQuickAction: (prompt: string) => void;
  onPat: () => void;
}

const BiboAvatar: React.FC<BiboAvatarProps> = ({ isLoading, mood, onQuickAction, onPat }) => {
  const getMouthPath = (currentMood: Mood) => {
    switch (currentMood) {
      case 'Happy':
        return "M 40 70 C 45 85, 55 85, 60 70"; // Wide 'D' smile
      case 'Curious':
        return "M 48 75 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0"; // Small 'o' mouth
      case 'Neutral':
      default:
        return "M 40 70 Q 50 80 60 70"; // Original gentle smile
    }
  };

  const QuickActionButton: React.FC<{ onClick: () => void; ariaLabel: string; children: React.ReactNode }> = ({ onClick, ariaLabel, children }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="bg-purple-500/20 backdrop-blur-sm text-purple-200 rounded-full p-2.5 hover:bg-purple-500/40 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      disabled={isLoading}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative w-40 h-40 md:w-48 md:h-48 transition-transform duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50"></div>
        <svg viewBox="0 0 100 100" className="relative z-10 animate-float">
          {/* Body */}
          <path d="M 50,95 C 20,95 10,70 10,50 C 10,30 20,5 50,5 C 80,5 90,30 90,50 C 90,70 80,95 50,95 Z" fill="url(#bibo-gradient)" />
          
          {/* Blushes */}
          <g className={`transition-opacity duration-500 ${mood === 'Happy' ? 'opacity-100' : 'opacity-0'}`}>
            <ellipse cx="28" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
            <ellipse cx="72" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
          </g>

          {/* Eyes */}
          <g transform="translate(0, -5)">
            <circle cx="35" cy="50" r="8" fill="white" />
            <circle cx="65" cy="50" r="8" fill="white" />
            <circle cx="37" cy="52" r="4" fill="black" className="animate-blink" />
            <circle cx="63" cy="52" r="4" fill="black" className="animate-blink" />
          </g>

          {/* Mouth */}
          <path d={getMouthPath(mood)} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Antenna */}
          <g>
            <path d="M 50 15 Q 40 0 35 5" stroke="#9333ea" strokeWidth="2.5" fill="none" />
            <circle cx="35" cy="5" r="4" fill="url(#antenna-orb)" />
          </g>
          
          <defs>
            <radialGradient id="bibo-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="antenna-orb">
                <stop offset="20%" stopColor="#f0abfc" />
                <stop offset="100%" stopColor="#d946ef" />
            </radialGradient>
            <radialGradient id="blush-gradient">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: center;
        }
      `}</style>
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider">bibo.bot</h1>
      <p className="text-purple-300">Your friendly AI companion</p>
      
      <div className="flex items-center space-x-4 pt-2">
        <QuickActionButton onClick={onPat} ariaLabel="Pat Bibo">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a.75.75 0 01.75.75V9h4.5a.75.75 0 010 1.5H10v4.5a.75.75 0 01-1.5 0V10.5H4a.75.75 0 010-1.5h4.5V4.25A.75.75 0 0110 3.5z" stroke="white" strokeWidth="1" opacity="0" />
            <path d="M10 5a1 1 0 011 1v3.5a.5.5 0 00.5.5h3.5a1 1 0 011 1v1a1 1 0 01-1 1h-3.5a.5.5 0 00-.5.5V16a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3.5a.5.5 0 00-.5-.5H3a1 1 0 01-1-1v-1a1 1 0 011-1h3.5a.5.5 0 00.5-.5V6a1 1 0 011-1h1z" opacity="0" />
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" opacity="0" />
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" opacity="0" />
            <path d="M18 8.25c0 1.31-2.686 2.5-6 2.5S6 9.56 6 8.25 8.686 5.75 12 5.75s6 1.19 6 2.5zM12 15.25c-3.314 0-6-1.19-6-2.5 0-.41.246-.78.648-1.085a.75.75 0 011.02.215 4.484 4.484 0 005.664 0 .75.75 0 011.02-.215A4.426 4.426 0 0118 12.75c0 1.31-2.686 2.5-6 2.5z" opacity="0"/>
            <path d="M10.362 3.234a.75.75 0 00-1.03-.002L3.234 8.632a.75.75 0 00-.236.53V15.75a.75.75 0 00.75.75h6.588a.75.75 0 00.53-.235l5.398-6.05a.75.75 0 00.002-1.03l-5.17-5.17zM9.5 6.5a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </QuickActionButton>
        <QuickActionButton onClick={() => onQuickAction("Tell me a funny joke! 🤣")} ariaLabel="Tell a joke">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.75.75 0 01.083-1.05l-.001-.001.001-.001a4.5 4.5 0 00-6.236 0l.001.001-.001.001a.75.75 0 01-1.05-.083l-.001-.001a.75.75 0 01.083-1.05l.001.001a6 6 0 118.485 0l.001-.001a.75.75 0 01.083 1.05l-.001.001z" clipRule="evenodd" />
          </svg>
        </QuickActionButton>
        <QuickActionButton onClick={() => onQuickAction("Ask me a really curious question! 🤔")} ariaLabel="Ask a question">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 114.95 4.95l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a1.5 1.5 0 00-2.122-2.122L8.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </QuickActionButton>
      </div>

    </div>
  );
};

export default BiboAvatar;