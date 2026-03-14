import React, { useState, useEffect } from 'react';
import { quotes } from '../data/words';
import { motion } from 'motion/react';
import { X, Trophy, Sparkles } from 'lucide-react';

interface RewardProps {
  onClose: () => void;
}

export const Reward: React.FC<RewardProps> = ({ onClose }) => {
  const [catImage, setCatImage] = useState('');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // 30 random cat patterns
    const randomCatId = Math.floor(Math.random() * 30) + 1;
    // Using picsum for reliable placeholder images
    setCatImage(`https://picsum.photos/seed/cat${randomCatId}/400/400`);
    
    // Random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#A89F91] hover:bg-[#F4A261] hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-[#E9C46A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#E9C46A]/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#5C4B41] mb-2">Goal Reached!</h2>
          <p className="text-[#A89F91] font-medium">You've reviewed 100+ words today.</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden mb-6 group shadow-md border border-[#E5E0D8]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          {catImage && (
            <img 
              src={catImage} 
              alt="Reward Cat" 
              className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <p className="text-white font-serif italic text-lg leading-snug drop-shadow-md">"{quote}"</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-[#F4A261] text-white rounded-xl font-bold text-lg hover:bg-[#E79453] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#F4A261]/30"
        >
          <Sparkles className="w-5 h-5" />
          Keep Going
        </button>
      </motion.div>
    </div>
  );
};
