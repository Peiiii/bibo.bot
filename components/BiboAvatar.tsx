
import React from 'react';

const BiboAvatar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`relative w-40 h-40 md:w-48 md:h-48 transition-transform duration-500 ${isLoading ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50"></div>
        <svg viewBox="0 0 100 100" className="relative z-10 animate-float">
          {/* Body */}
          <path d="M 50,95 C 20,95 10,70 10,50 C 10,30 20,5 50,5 C 80,5 90,30 90,50 C 90,70 80,95 50,95 Z" fill="url(#bibo-gradient)" />
          
          {/* Eyes */}
          <g transform="translate(0, -5)">
            <circle cx="35" cy="50" r="8" fill="white" />
            <circle cx="65" cy="50" r="8" fill="white" />
            <circle cx="37" cy="52" r="4" fill="black" className="animate-blink" />
            <circle cx="63" cy="52" r="4" fill="black" className="animate-blink" />
          </g>

          {/* Mouth */}
          <path d="M 40 70 Q 50 80 60 70" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />

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
    </div>
  );
};

export default BiboAvatar;
