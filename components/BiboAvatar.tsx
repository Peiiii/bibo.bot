import React, { useState, forwardRef } from 'react';
import { Mood } from '../types';

interface BiboAvatarProps {
  isLoading: boolean;
  mood: Mood;
  onQuickAction: (prompt: string) => void;
  onPat: () => void;
  pupilOffset: { x: number; y: number };
  headTilt: number;
}

const BiboAvatar = forwardRef<HTMLDivElement, BiboAvatarProps>(({ isLoading, mood, onQuickAction, onPat, pupilOffset, headTilt }, ref) => {
  const [isJiggling, setIsJiggling] = useState(false);

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
  
  const handleClick = () => {
    if (isLoading) return;
    onPat();
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 400);
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
      <div
        ref={ref}
        onClick={handleClick}
        className={`relative w-40 h-40 md:w-48 md:h-48 group cursor-pointer transition-transform duration-500 ${isLoading ? 'animate-pulse' : ''}`}
        aria-label="Interact with Bibo"
      >
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50 transition-opacity duration-300"></div>
        <svg viewBox="0 0 100 100" className={`relative z-10 animate-breathe ${isJiggling ? 'animate-jiggle' : ''}`}>
          <path d="M 50,95 C 20,95 10,70 10,50 C 10,30 20,5 50,5 C 80,5 90,30 90,50 C 90,70 80,95 50,95 Z" fill="url(#bibo-gradient)" className="transition-all duration-300" />
          
          <g style={{ transform: `rotate(${headTilt}deg)`, transition: 'transform 0.3s ease-out', transformOrigin: '50% 80%' }}>
            <g className={`transition-opacity duration-500 ${mood === 'Happy' ? 'opacity-100' : 'opacity-0'}`}>
              <ellipse cx="28" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
              <ellipse cx="72" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
            </g>

            <g transform="translate(0, -5)">
              <circle cx="35" cy="50" r="8" fill="white" />
              <circle cx="65" cy="50" r="8" fill="white" />
              <circle cx={35 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
              <circle cx={65 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
            </g>

            <path d={getMouthPath(mood)} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          <g>
            <path d="M 50 15 Q 40 0 35 5" stroke="#9333ea" strokeWidth="2.5" fill="none" />
            <circle cx="35" cy="5" r="4" fill="url(#antenna-orb)" className="animate-antenna-pulse group-hover:animate-antenna-pulse-fast" />
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
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: center;
        }
        @keyframes antenna-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-antenna-pulse {
          animation: antenna-pulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-antenna-pulse-fast {
          animation: antenna-pulse 0.8s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes jiggle {
            0%, 100% { transform: translate(-1px, 1px) rotate(-1deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
        }
        .animate-jiggle {
          animation: jiggle 0.4s linear;
        }
      `}</style>
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wider">bibo.bot</h1>
      <p className="text-purple-300">Your friendly AI companion</p>
      
      <div className="flex items-center space-x-4 pt-2">
        <QuickActionButton onClick={onPat} ariaLabel="Pat Bibo">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
});

BiboAvatar.displayName = "BiboAvatar";

export default BiboAvatar;
