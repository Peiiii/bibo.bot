import React, { useState } from 'react';
import { Location, LocationId } from '../types';

interface WorldViewProps {
    locations: Location[];
    currentLocationId: LocationId;
    onLocationClick: (locationId: LocationId) => void;
}

const WorldView: React.FC<WorldViewProps> = ({ locations, currentLocationId, onLocationClick }) => {
  const currentLocation = locations.find(l => l.id === currentLocationId);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - svgRect.left) / svgRect.width - 0.5;
    const y = (e.clientY - svgRect.top) / svgRect.height - 0.5;
    setParallax({ x: x * 20, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div className="aspect-w-4 aspect-h-3 w-full rounded-lg overflow-hidden">
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-full bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <radialGradient id="sky-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2c1a4c" />
                <stop offset="100%" stopColor="#1a0f2e" />
            </radialGradient>
            <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4c1d95" />
                <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
            <filter id="island-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
            </filter>
        </defs>
        
        <rect width="400" height="300" fill="url(#sky-gradient)" />
        
        <g style={{ transform: `translate(${parallax.x * 0.2}px, ${parallax.y * 0.2}px)`, transition: 'transform 0.2s ease-out' }}>
            {/* Stars */}
            <circle cx="50" cy="50" r="1" fill="#fff" className="animate-twinkle" style={{animationDelay: '0s'}}/>
            <circle cx="150" cy="30" r="0.8" fill="#fff" className="animate-twinkle" style={{animationDelay: '1s'}}/>
            <circle cx="250" cy="60" r="1.2" fill="#fff" className="animate-twinkle" style={{animationDelay: '0.5s'}}/>
            <circle cx="350" cy="40" r="0.6" fill="#fff" className="animate-twinkle" style={{animationDelay: '1.5s'}}/>
        </g>
        
        {/* Distant floating rocks */}
        <g style={{ transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`, transition: 'transform 0.2s ease-out' }}>
            <path d="M 30 80 c 20 -10 40 10 60 0 l 0 15 c -20 10 -40 -10 -60 0 Z" fill="#1e1b4b" opacity="0.5"/>
            <path d="M 320 100 c 20 -10 40 10 50 0 l 0 12 c -15 10 -35 -10 -50 0 Z" fill="#1e1b4b" opacity="0.5"/>
        </g>
        
        {/* Clouds */}
         <g style={{ transform: `translate(${parallax.x * 0.6}px, ${parallax.y * 0.6}px)`, transition: 'transform 0.2s ease-out' }}>
            <circle cx="100" cy="120" r="20" fill="white" opacity="0.05" className="animate-drift" style={{animationDuration: '60s'}}/>
            <circle cx="120" cy="125" r="25" fill="white" opacity="0.05" className="animate-drift" style={{animationDuration: '60s'}}/>
            <circle cx="280" cy="90" r="30" fill="white" opacity="0.05" className="animate-drift-reverse" style={{animationDuration: '75s'}}/>
        </g>

        {/* Water with shimmer */}
        <path d="M -10 250 C 100 230, 300 270, 410 250 V 310 H -10 Z" fill="url(#water-gradient)" />
        <path d="M -10 250 C 100 230, 300 270, 410 250" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.5" className="animate-shimmer" />

        {/* Floating Island */}
        <g style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)`, transition: 'transform 0.2s ease-out' }}>
            <g style={{filter: 'url(#island-shadow)'}}>
                <path d="M 50 200 C -20 150, 420 150, 350 200 C 320 280, 80 280, 50 200 Z" fill="#211538" />
                <path d="M 50 200 C -20 150, 420 150, 350 200" fill="#4d7c0f" stroke="#a3e635" strokeWidth="1" />
                <path d="M 180 160 c 10 -5 20 0 30 -2 l 10 5 c -10 5 -20 0 -30 2 Z" fill="#365314" />
                <path d="M 90 210 c 15 -5 30 0 40 -2 l 10 5 c -15 5 -30 0 -40 2 Z" fill="#365314" />
            </g>

            {/* Dashed Path between locations */}
            <g stroke="#f0abfc" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                <path d="M 200 160 C 130 170, 110 200, 100 205" fill="none" className="animate-path-dash"/>
                <path d="M 200 160 C 270 170, 290 200, 312 210" fill="none" className="animate-path-dash" style={{animationDelay: '0.5s'}}/>
            </g>
            
            {locations.map(loc => (
                <g 
                    key={loc.id} 
                    transform={`translate(${loc.coords.x.slice(0,-1) * 4}, ${loc.coords.y.slice(0,-1) * 3})`}
                    onClick={() => onLocationClick(loc.id)}
                    className="cursor-pointer group"
                >
                    <circle r="6" fill="#f0abfc" opacity="0.8" className="group-hover:scale-125 transition-transform"/>
                    <text x="10" y="5" fill="#fafafa" fontSize="12" textAnchor="start" className="group-hover:fill-white font-bold transition-colors" style={{pointerEvents: 'none', filter: 'drop-shadow(0 0 2px black)'}}>{loc.name}</text>
                </g>
            ))}

            {/* Current Location Marker */}
            {currentLocation && (
                <g transform={`translate(${currentLocation.coords.x.slice(0,-1) * 4}, ${currentLocation.coords.y.slice(0,-1) * 3})`} style={{ transition: 'transform 1s ease-in-out', pointerEvents: 'none' }}>
                    <circle r="12" fill="#f0abfc" fillOpacity="0.3" className="animate-ping-slow" />
                    <circle r="8" fill="#f0abfc" stroke="#fff" strokeWidth="1.5" style={{ filter: 'url(#glow)' }} />
                </g>
            )}
        </g>
        
        <style>{`
            @keyframes twinkle { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
            .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
            
            @keyframes shimmer { 
                0% { d: path("M -10 250 C 100 230, 300 270, 410 250"); }
                50% { d: path("M -10 250 C 150 270, 250 230, 410 250"); }
                100% { d: path("M -10 250 C 100 230, 300 270, 410 250"); }
            }
            .animate-shimmer { animation: shimmer 8s ease-in-out infinite; }
            
            @keyframes ping-slow {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.5); opacity: 0; }
            }
            .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; transform-origin: center; }

            @keyframes path-dash {
                to { stroke-dashoffset: -8; }
            }
            .animate-path-dash { animation: path-dash 0.5s linear infinite; }
            
            @keyframes drift {
                0% { transform: translateX(-50px); }
                100% { transform: translateX(450px); }
            }
            .animate-drift { animation: drift linear infinite; }

            @keyframes drift-reverse {
                0% { transform: translateX(450px); }
                100% { transform: translateX(-50px); }
            }
            .animate-drift-reverse { animation: drift-reverse linear infinite; }
        `}</style>
      </svg>
    </div>
  );
};

export default WorldView;
