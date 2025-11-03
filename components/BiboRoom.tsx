import React from 'react';

const BiboRoom: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="room-light" cx="50%" cy="20%" r="70%">
            <stop offset="0%" stopColor="var(--light-color, #ffffff)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--light-color, #ffffff)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wall-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c1a4c" />
            <stop offset="100%" stopColor="#1a0f2e" />
          </linearGradient>
        </defs>
        
        {/* Background */}
        <rect width="400" height="300" fill="url(#wall-gradient)" />
        
        {/* Ambient Light */}
        <rect width="400" height="300" fill="url(#room-light)" opacity="var(--ambience-opacity, 0.3)" className="transition-all duration-1000 ease-in-out"/>

        {/* Window */}
        <g transform="translate(280, 50)">
          <rect x="0" y="0" width="90" height="100" rx="5" fill="#11091e" />
          <path d="M 45 0 V 100 M 0 50 H 90" stroke="#000" strokeWidth="3" opacity="0.5" />
          {/* Stars */}
          <circle cx="20" cy="20" r="1" fill="#fff" className="animate-twinkle" style={{animationDelay: '0.5s'}}/>
          <circle cx="60" cy="35" r="0.8" fill="#fff" className="animate-twinkle" style={{animationDelay: '1.5s'}}/>
          <circle cx="75" cy="70" r="1.2" fill="#fff" className="animate-twinkle" style={{animationDelay: '0.2s'}}/>
          <circle cx="30" cy="80" r="0.6" fill="#fff" className="animate-twinkle" style={{animationDelay: '2s'}}/>
        </g>

        {/* Floating Shelf */}
        <g transform="translate(30, 150)">
          <rect x="0" y="0" width="100" height="8" rx="2" fill="#3a245f" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))'}} />
          {/* Books */}
          <rect x="10" y="-20" width="10" height="20" fill="#a78bfa" rx="1"/>
          <rect x="22" y="-25" width="12" height="25" fill="#f472b6" rx="1"/>
          <rect x="36" y="-18" width="10" height="18" fill="#60a5fa" rx="1"/>
        </g>

        {/* Plant */}
        <g transform="translate(50, 220)" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))'}}>
            <path d="M 0 0 C 10 0, 10 20, 20 20" stroke="#4d7c0f" strokeWidth="2" fill="none" />
            <path d="M 20 20 C 30 20, 30 0, 40 0" stroke="#4d7c0f" strokeWidth="2" fill="none" />
            <circle cx="20" cy="-2" r="18" fill="#3a245f" />
            <circle cx="20" cy="-2" r="15" fill="#52397d" />
            <path d="M 20 20 Q 10 40 0 50" stroke="#a3e635" strokeWidth="3" fill="none" className="animate-sway" style={{transformOrigin: '20px 20px'}}/>
            <path d="M 20 20 Q 35 35 45 40" stroke="#a3e635" strokeWidth="2.5" fill="none" className="animate-sway" style={{transformOrigin: '20px 20px', animationDelay: '0.5s'}}/>
        </g>
      </svg>
      <style>{`
        @keyframes twinkle {
            0%, 100% { opacity: 0.5; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
            animation: twinkle 4s ease-in-out infinite;
        }
        @keyframes sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        .animate-sway {
            animation: sway 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BiboRoom;
