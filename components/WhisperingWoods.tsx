import React from 'react';

const WhisperingWoods: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="woods-light" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--light-color, #ffffff)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--light-color, #ffffff)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="woods-sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id="woods-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background */}
        <rect width="400" height="300" fill="url(#woods-sky-gradient)" />
        
        {/* Ambient Light */}
        <rect width="400" height="300" fill="url(#woods-light)" opacity="var(--ambience-opacity, 0.3)" className="transition-all duration-1000 ease-in-out"/>

        {/* Trees */}
        <g opacity="0.8">
            <path d="M 50 300 C 60 200, 40 100, 70 50 S 100 0, 100 0" stroke="#3f3f46" strokeWidth="20" fill="none" strokeLinecap="round" />
            <path d="M 350 300 C 340 200, 360 100, 330 50 S 300 0, 300 0" stroke="#3f3f46" strokeWidth="25" fill="none" strokeLinecap="round" />
            <path d="M 150 300 C 140 250, 160 150, 140 100" stroke="#52525b" strokeWidth="15" fill="none" strokeLinecap="round" />
             <path d="M 250 300 C 260 250, 240 150, 260 100" stroke="#52525b" strokeWidth="18" fill="none" strokeLinecap="round" />
        </g>

        {/* Ground */}
        <path d="M 0 280 C 100 270, 300 290, 400 280 V 300 H 0 Z" fill="#1e293b" />
        
        {/* Glowing Mushrooms */}
        <g style={{filter: 'url(#woods-glow)'}}>
            <g transform="translate(80, 280)">
                <path d="M 0 0 C 0 -10, 20 -10, 20 0 Z" fill="#a78bfa" />
                <rect x="8" y="0" width="4" height="5" fill="#8b5cf6"/>
            </g>
            <g transform="translate(320, 285)">
                <path d="M 0 0 C 0 -8, 15 -8, 15 0 Z" fill="#f472b6" />
                <rect x="6" y="0" width="3" height="4" fill="#ec4899"/>
            </g>
            <g transform="translate(200, 290)">
                <path d="M 0 0 C 0 -12, 25 -12, 25 0 Z" fill="#60a5fa" />
                <rect x="10" y="0" width="5" height="6" fill="#3b82f6"/>
            </g>
        </g>

        {/* Drifting Motes */}
        <circle cx="100" cy="150" r="2" fill="#f0abfc" className="animate-mote" style={{animationDelay: '0s'}}/>
        <circle cx="200" cy="200" r="1.5" fill="#fef08a" className="animate-mote" style={{animationDelay: '2s'}}/>
        <circle cx="300" cy="100" r="2.5" fill="#fafafa" className="animate-mote" style={{animationDelay: '1s'}}/>
        <circle cx="50" cy="250" r="1.8" fill="#f0abfc" className="animate-mote" style={{animationDelay: '3s'}}/>
         <circle cx="350" cy="220" r="1.2" fill="#fef08a" className="animate-mote" style={{animationDelay: '0.5s'}}/>
      </svg>
      <style>{`
        @keyframes mote-drift {
            0% { transform: translate(0, 0); opacity: 0; }
            25% { opacity: 0.7; }
            75% { opacity: 0.7; }
            100% { transform: translate(10px, -80px); opacity: 0; }
        }
        .animate-mote {
            animation: mote-drift 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WhisperingWoods;
