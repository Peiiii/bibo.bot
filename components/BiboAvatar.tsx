import React, { useState, useRef } from 'react';
import { Mood } from '../types';

interface BiboAvatarProps {
  isLoading: boolean;
  mood: Mood;
  onMoodChange: (mood: Mood) => void;
  pupilOffset: { x: number; y: number };
  headTilt: number;
}

const moods: Mood[] = ['Happy', 'Silly', 'Love', 'Curious', 'Cool', 'Sad', 'Surprised', 'Wink', 'Neutral'];
const moodEmojis: { [key in Mood]: string } = {
    Happy: '😄',
    Silly: '😜',
    Love: '😍',
    Curious: '🤔',
    Cool: '😎',
    Sad: '😢',
    Surprised: '😮',
    Wink: '😉',
    Neutral: '😐',
};

const BiboAvatar: React.FC<BiboAvatarProps> = ({ isLoading, mood, onMoodChange, pupilOffset, headTilt }) => {
  const [isJiggling, setIsJiggling] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; angle: number; color: string }>>([]);
  const [isMoodSelectorVisible, setIsMoodSelectorVisible] = useState(false);
  const clickTimestamps = useRef<number[]>([]);

  const getMouthPath = (currentMood: Mood) => {
    switch (currentMood) {
      case 'Silly':
      case 'Happy':
      case 'Wink':
      case 'Love':
        return "M 40 70 C 45 85, 55 85, 60 70"; // Wide 'D' smile
      case 'Curious':
        return "M 48 75 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0"; // Small 'o' mouth
      case 'Surprised':
        return "M 50 78 a 6 6 0 1 0 0.001 0"; // Larger open 'O' mouth
      case 'Sad':
        return "M 40 80 Q 50 70 60 80"; // Sad mouth
      case 'Cool':
        return "M 42 75 Q 50 80 58 75"; // Slight smirk
      case 'Neutral':
      default:
        return "M 40 70 Q 50 80 60 70"; // Original gentle smile
    }
  };

  const getAntennaPulseSpeed = (currentMood: Mood) => {
    switch (currentMood) {
      case 'Happy':
      case 'Surprised':
      case 'Love':
      case 'Silly':
        return '1s';
      case 'Sad':
        return '4s';
      default:
        return '2s';
    }
  };
  
  const handleMoodSelect = (selectedMood: Mood) => {
    onMoodChange(selectedMood);
    setIsMoodSelectorVisible(false);
  };

  const handleClick = () => {
    if (isLoading) return;

    const now = Date.now();
    clickTimestamps.current.push(now);
    clickTimestamps.current = clickTimestamps.current.filter(ts => now - ts < 700);

    if (clickTimestamps.current.length >= 3) {
      setIsMoodSelectorVisible(v => !v);
      clickTimestamps.current = []; // Reset after triggering
      return;
    }

    if (isMoodSelectorVisible) {
        setIsMoodSelectorVisible(false);
        return;
    }

    onMoodChange('Happy');
    setIsJiggling(true);

    const newSparkles = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random(),
      angle: (360 / 8) * i,
      color: ['#f0abfc', '#fef08a', '#fafafa'][Math.floor(Math.random() * 3)],
    }));
    setSparkles(newSparkles);

    setTimeout(() => setIsJiggling(false), 400);
    setTimeout(() => setSparkles([]), 600);
  };

  return (
    <div
      className={`relative w-40 h-40 md:w-48 md:h-48 group cursor-pointer transition-transform duration-500 ${isLoading ? 'animate-pulse' : ''}`}
      aria-label="Interact with Bibo"
    >
      {isMoodSelectorVisible && (
         <div 
            className="absolute inset-0 z-20 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setIsMoodSelectorVisible(false); }}
         >
            <div 
                className="absolute -top-40 bg-purple-900/60 backdrop-blur-lg p-3 rounded-xl shadow-lg animate-mood-pop-in"
                onClick={e => e.stopPropagation()}
             >
                <div className="grid grid-cols-3 gap-2">
                    {moods.map((m) => (
                        <button
                            key={m}
                            onClick={() => handleMoodSelect(m)}
                            className="w-12 h-12 bg-purple-600/50 rounded-full text-2xl flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-125 hover:bg-purple-500"
                            aria-label={`Set mood to ${m}`}
                        >
                            {moodEmojis[m]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
      <div onClick={handleClick}>
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-50 transition-opacity duration-300"></div>
          <svg viewBox="0 0 100 100" className={`relative z-10 animate-breathe ${isJiggling ? 'animate-jiggle' : ''}`} style={{ filter: 'drop-shadow(0 4px 10px rgba(168, 85, 247, 0.4))' }}>
            <path d="M 50,95 C 20,95 10,70 10,50 C 10,30 20,5 50,5 C 80,5 90,30 90,50 C 90,70 80,95 50,95 Z" fill="url(#bibo-gradient)" className="transition-all duration-300" />
            
            <g style={{ transform: `rotate(${headTilt}deg)`, transition: 'transform 0.3s ease-out', transformOrigin: '50% 80%' }}>
              <g className={`transition-opacity duration-500 ${mood === 'Happy' || mood === 'Love' || mood === 'Silly' ? 'opacity-100' : 'opacity-0'}`}>
                <ellipse cx="28" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
                <ellipse cx="72" cy="60" rx="8" ry="4" fill="url(#blush-gradient)" />
              </g>

              <g transform="translate(0, -5)">
                <circle cx="35" cy="50" r="8" fill="white" />
                <circle cx="65" cy="50" r="8" fill="white" />
                
                {(mood !== 'Cool' && mood !== 'Wink' && mood !== 'Love') && (
                  <g>
                      <circle cx="37" cy="48" r="1.5" fill="white" opacity="0.9" />
                      <circle cx="67" cy="48" r="1.5" fill="white" opacity="0.9" />
                  </g>
                )}
                
                {mood === 'Love' && (
                    <g>
                        <g transform={`translate(${35 + pupilOffset.x}, ${50 + pupilOffset.y})`}>
                            <g className="animate-love-pulse" style={{transformOrigin: 'center'}}>
                                <path transform="scale(1.1) translate(0, 1)" d="M0,-5 C-3,-8 -7,-6 -7,-2 C-7,2 0,4 0,6 C0,4 7,2 7,-2 C7,-6 3,-8 0,-5 Z" fill="#ff4d6d" />
                            </g>
                        </g>
                        <g transform={`translate(${65 + pupilOffset.x}, ${50 + pupilOffset.y})`}>
                            <g className="animate-love-pulse" style={{transformOrigin: 'center'}}>
                                <path transform="scale(1.1) translate(0, 1)" d="M0,-5 C-3,-8 -7,-6 -7,-2 C-7,2 0,4 0,6 C0,4 7,2 7,-2 C7,-6 3,-8 0,-5 Z" fill="#ff4d6d" />
                            </g>
                        </g>
                    </g>
                )}

                {mood === 'Wink' && (
                    <g>
                        <circle cx={35 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
                        <path d="M 62 50 C 65 48, 68 48, 71 50" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }} />
                    </g>
                )}

                {mood === 'Silly' && (
                  <g>
                      <circle cx={35 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
                      <path d="M 62 50 C 65 48, 68 48, 71 50" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)` }} />
                  </g>
                )}

                {(mood !== 'Love' && mood !== 'Wink' && mood !== 'Cool' && mood !== 'Silly') && (
                    <g>
                        <circle cx={35 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
                        <circle cx={65 + pupilOffset.x} cy={50 + pupilOffset.y} r="4" fill="black" className="animate-blink transition-transform duration-100 ease-out" />
                    </g>
                )}

                {mood === 'Cool' && (
                  <g style={{ transform: `translate(${pupilOffset.x * 0.5}px, ${pupilOffset.y * 0.5}px)` }}>
                      {/* Frame */}
                      <path d="M22,43 C18,43,18,60,25,60 L45,60 C52,60,52,43,45,43 Z M55,43 C48,43,48,60,55,60 L75,60 C82,60,82,43,75,43 Z M45,51.5 L55,51.5" fill="#222" stroke="#111" strokeWidth="1.5" />
                      {/* Dynamic Glare */}
                      <path d={`M28 52 Q ${33 - headTilt * 0.1} 48 ${38 - headTilt * 0.2} 53`} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" fill="none" />
                      <path d={`M58 52 Q ${63 - headTilt * 0.1} 48 ${68 - headTilt * 0.2} 53`} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" fill="none" />
                  </g>
                )}
              </g>

              <path d={getMouthPath(mood)} stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" style={{transition: 'd 0.3s cubic-bezier(0.4, 0, 0.2, 1)'}} />
              
              {mood === 'Silly' && (
                <g style={{ transform: `translate(${pupilOffset.x * 0.2}px, 0)`}}>
                  <path d="M43 82 C 42 96, 58 96, 57 82 Z" fill="#f472b6" />
                  <path d="M50 83 V 90" stroke="#e11d48" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                </g>
              )}
            </g>

            <g>
              <path d="M 50 15 Q 40 0 35 5" stroke="#9333ea" strokeWidth="2.5" fill="none" />
              <circle cx="35" cy="5" r="4" fill="url(#antenna-orb)" className="animate-antenna-pulse" style={{ animationDuration: getAntennaPulseSpeed(mood) }}/>
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
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map(s => (
          <svg key={s.id} viewBox="0 0 10 10" className="absolute w-4 h-4 overflow-visible" style={{ top: '50%', left: '50%', transform: `rotate(${s.angle}deg)` }}>
            <path
              d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
              fill={s.color}
              className="animate-sparkle-burst"
            />
          </svg>
        ))}
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
        @keyframes love-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.07); }
        }
        .animate-love-pulse {
          animation: love-pulse 1.5s ease-in-out infinite;
        }
        @keyframes sparkle-burst {
          0% {
            transform: scale(0) translateY(0px);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translateY(-60px);
            opacity: 0;
          }
        }
        .animate-sparkle-burst {
          transform-origin: center;
          animation: sparkle-burst 0.6s ease-out;
        }
        @keyframes mood-pop-in {
          0% { transform: scale(0.8) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-mood-pop-in {
            transform-origin: bottom center;
            animation: mood-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default BiboAvatar;
