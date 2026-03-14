import React, { useState, useEffect } from 'react';
import { Word } from '../data/words';
import { ScratchCard } from './ScratchCard';
import { reviewWord, getDueWords, getFavorites, toggleFavorite } from '../utils/ebbinghaus';
import { Volume2, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface WordListProps {
  category: string;
  order: 'sequential' | 'random';
  handedness: 'right' | 'left';
  mode: 'new' | 'review' | 'all';
  onDailyGoalUpdate: (count: number) => void;
}

const HeartA = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <text x="5" y="10" fontSize="8" fill="currentColor" strokeWidth="0" fontWeight="bold">A</text>
    <path d="M12 17.5l-4.5-4.5a3.18 3.18 0 0 1 0-4.5 3.18 3.18 0 0 1 4.5 0 3.18 3.18 0 0 1 4.5 0 3.18 3.18 0 0 1 0 4.5z" fill="#EF4444" stroke="none" />
    <path d="M9.5 8.5 L10.5 6 L12 8.5 L13.5 6 L14.5 8.5" stroke="#EF4444" strokeWidth="1" fill="none" />
  </svg>
);

const SpadeQ = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <text x="5" y="10" fontSize="8" fill="currentColor" strokeWidth="0" fontWeight="bold">Q</text>
    <path d="M12 8.5c-3 3-4.5 5-4.5 6.5a4.5 4.5 0 0 0 9 0c0-1.5-1.5-3.5-4.5-6.5z" fill="#1F2937" stroke="none" />
    <path d="M12 15v3" stroke="#1F2937" strokeWidth="2" />
    <path d="M9.5 10.5 L10.5 8 L12 10.5 L13.5 8 L14.5 10.5" stroke="#1F2937" strokeWidth="1" fill="none" />
  </svg>
);

export const WordList: React.FC<WordListProps> = ({ category, order, handedness, mode, onDailyGoalUpdate }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [revealedWords, setRevealedWords] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(new Set(getFavorites()));
    
    const savedState = localStorage.getItem(`vocab_state_${category}_${order}_${mode}`);
    if (savedState) {
      try {
        const { savedWords, savedRevealed } = JSON.parse(savedState);
        if (savedWords && savedWords.length > 0) {
          setWords(savedWords);
          setRevealedWords(new Set(savedRevealed));
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    
    loadWords(true);
  }, [category, order, mode]);

  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem(`vocab_state_${category}_${order}_${mode}`, JSON.stringify({
        savedWords: words,
        savedRevealed: Array.from(revealedWords)
      }));
    }
  }, [words, revealedWords, category, order, mode]);

  const loadWords = (reset = false) => {
    const currentIds = reset ? [] : words.map(w => w.id);
    const due = getDueWords(category, 20, order, currentIds, mode);
    if (reset) {
      setWords(due);
      setRevealedWords(new Set());
    } else {
      setWords(prev => [...prev, ...due]);
    }
  };

  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReveal = (wordId: string) => {
    if (!revealedWords.has(wordId)) {
      setRevealedWords(prev => new Set(prev).add(wordId));
      reviewWord(wordId, 4);
      onDailyGoalUpdate(1);
    }
  };

  const handleToggleFavorite = (wordId: string) => {
    const isFav = toggleFavorite(wordId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFav) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
  };

  const handleRevealAll = () => {
    const newRevealed = new Set(revealedWords);
    let newCount = 0;
    words.forEach(w => {
      if (!newRevealed.has(w.id)) {
        newRevealed.add(w.id);
        reviewWord(w.id, 4);
        newCount++;
      }
    });
    setRevealedWords(newRevealed);
    if (newCount > 0) {
      onDailyGoalUpdate(newCount);
    }
  };

  const handleHideAll = () => {
    setRevealedWords(new Set());
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-[#E9C46A] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-[#5C4B41] mb-2">All caught up!</h2>
        <p className="text-[#A89F91]">
          {mode === 'review' 
            ? `You've reviewed all due ${category} words for now.` 
            : `No more ${category} words to show in this mode.`}
        </p>
        <button 
          onClick={() => loadWords(true)}
          className="mt-8 px-6 py-3 bg-[#F4A261] text-white rounded-full font-medium hover:bg-[#E79453] transition-colors"
        >
          Check again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center px-2">
        <button 
          onClick={handleRevealAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D8] rounded-xl text-[#EF4444] hover:bg-red-50 transition-colors shadow-sm font-medium text-sm"
        >
          <HeartA />
          我要验牌
        </button>
        <button 
          onClick={handleHideAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D8] rounded-xl text-[#1F2937] hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
        >
          <SpadeQ />
          牌冇问题
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D8] overflow-hidden">
        {words.map((word) => {
          const isRevealed = revealedWords.has(word.id);
          const isFav = favorites.has(word.id);
          return (
            <div
              key={word.id}
              className={`grid grid-cols-2 border-b border-[#E5E0D8] last:border-0 transition-colors duration-300 ${isRevealed ? 'bg-green-50/30' : ''}`}
            >
              {/* English Side */}
              <div className={`p-4 flex flex-col justify-center ${handedness === 'left' ? 'order-2' : 'order-1 border-r border-[#E5E0D8]'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`text-lg font-bold ${isRevealed ? 'text-[#A89F91]' : 'text-[#5C4B41]'}`}>{word.word}</h3>
                    <p className="text-[#A89F91] font-mono text-xs">{word.phonetic}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleToggleFavorite(word.id)}
                      className={`p-1.5 rounded-full transition-colors ${isFav ? 'text-[#E9C46A] hover:bg-yellow-50' : 'text-[#D5CFC4] hover:bg-[#FAF8F5]'}`}
                    >
                      <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={() => playAudio(word.word)}
                      className="text-[#F4A261] p-1.5 hover:bg-[#FAF8F5] rounded-full transition-colors"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chinese Side */}
              <div className={`p-4 relative flex items-center ${handedness === 'left' ? 'order-1 border-r border-[#E5E0D8]' : 'order-2'}`}>
                {isRevealed ? (
                  <div className="text-sm text-[#A89F91] w-full">{word.meanings.join('; ')}</div>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center">
                    <ScratchCard onReveal={() => handleReveal(word.id)}>
                      <div className="text-sm text-[#5C4B41]">{word.meanings.join('; ')}</div>
                    </ScratchCard>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center pt-4">
        <button 
          onClick={() => loadWords(false)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E5E0D8] rounded-full text-[#5C4B41] hover:text-[#F4A261] hover:border-[#F4A261] font-medium transition-colors shadow-sm"
        >
          Load more words <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
