import React from 'react';

const CrystalCaves: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="cave-light" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="var(--light-color, #ffffff)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--light-color, #ffffff)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cave-wall-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="crystal-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#c7d2fe" />
          </linearGradient>
          <linearGradient id="crystal-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="100%" stopColor="#f5d0fe" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="400" height="300" fill="url(#cave-wall-gradient)" />
        <rect width="400" height="300" fill="#000" opacity="0.2" />

        {/* Ambient Light */}
        <rect width="400" height="300" fill="url(#cave-light)" opacity="var(--ambience-opacity, 0.3)" className="transition-all duration-1000 ease-in-out"/>

        {/* Crystal Formations */}
        <g opacity="0.8">
            {/* Background Crystals */}
            <path d="M 50 300 L 70 200 L 90 300 Z" fill="url(#crystal-gradient-1)" opacity="0.3" />
            <path d="M 320 300 L 300 150 L 340 300 Z" fill="url(#crystal-gradient-2)" opacity="0.4" />
            <path d="M 0 100 L 20 50 L 40 120 Z" fill="url(#crystal-gradient-1)" opacity="0.2" />
            <path d="M 400 80 L 380 40 L 360 90 Z" fill="url(#crystal-gradient-2)" opacity="0.2" />

            {/* Foreground Crystals */}
            <g transform="translate(80, 150)" className="animate-crystal-pulse" style={{animationDelay: '0.5s'}}>
                 <path d="M 0 150 L 50 50 L 100 150 Z" fill="url(#crystal-gradient-1)" stroke="#e0e7ff" strokeWidth="1" />
                 <path d="M 50 50 L 25 150 L 75 150 Z" fill="#c7d2fe" opacity="0.5" />
            </g>
            <g transform="translate(250, 180)" className="animate-crystal-pulse" style={{animationDelay: '0s'}}>
                <path d="M 0 120 L 30 20 L 60 120 Z" fill="url(#crystal-gradient-2)" stroke="#fce7f3" strokeWidth="1"/>
                <path d="M 30 20 L 15 120 L 45 120 Z" fill="#fbcfe8" opacity="0.5" />
            </g>
             <g transform="translate(-20, 200)" className="animate-crystal-pulse" style={{animationDelay: '1s'}}>
                <path d="M 0 100 L 20 30 L 40 100 Z" fill="url(#crystal-gradient-1)" stroke="#e0e7ff" strokeWidth="0.5"/>
            </g>
        </g>
        
        {/* Sparkles */}
        <circle cx="150" cy="150" r="1.5" fill="#fff" className="animate-sparkle-flicker" style={{animationDelay: '0.2s'}}/>
        <circle cx="280" cy="210" r="1" fill="#fff" className="animate-sparkle-flicker" style={{animationDelay: '0.8s'}}/>
        <circle cx="90" cy="250" r="2" fill="#fff" className="animate-sparkle-flicker" style={{animationDelay: '0.5s'}}/>
        <circle cx="330" cy="100" r="1.2" fill="#fff" className="animate-sparkle-flicker" style={{animationDelay: '1.2s'}}/>

      </svg>
      <style>{`
        @keyframes crystal-pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        .animate-crystal-pulse {
            animation: crystal-pulse 5s ease-in-out infinite;
        }
        @keyframes sparkle-flicker {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        .animate-sparkle-flicker {
            animation: sparkle-flicker 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CrystalCaves;
