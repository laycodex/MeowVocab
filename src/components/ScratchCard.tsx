import React, { useState } from 'react';

interface ScratchCardProps {
  children: React.ReactNode;
  onReveal?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ children, onReveal }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      if (onReveal) onReveal();
    }
  };

  const cursorSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='40' height='40'><path fill='%23F4A261' d='M50 90 C 20 90, 10 60, 20 40 C 30 20, 70 20, 80 40 C 90 60, 80 90, 50 90 Z'/><circle fill='%23FFD1A9' cx='30' cy='30' r='12'/><circle fill='%23FFD1A9' cx='50' cy='20' r='14'/><circle fill='%23FFD1A9' cx='70' cy='30' r='12'/><path fill='%23FFD1A9' d='M50 80 C 30 80, 25 60, 35 50 C 45 40, 55 40, 65 50 C 75 60, 70 80, 50 80 Z'/></svg>`;

  return (
    <div 
      className="relative w-full h-full min-h-[40px] overflow-hidden rounded-lg flex items-center"
      style={{
        cursor: isRevealed ? 'default' : `url("${cursorSvg}") 20 20, pointer`
      }}
    >
      <div className={`w-full transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
      {!isRevealed && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#E5E0D8] flex items-center justify-center text-[#C8C0B1] text-xs font-medium"
          onPointerDown={handleReveal}
        >
          点击刮开
        </div>
      )}
    </div>
  );
};
