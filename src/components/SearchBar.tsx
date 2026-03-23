import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Star, Volume2 } from 'lucide-react';
import { Word, getWords } from '../data/words';
import { getFavorites, toggleFavorite } from '../utils/ebbinghaus';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Word[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [allWords, setAllWords] = useState<Word[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getWords().then(setAllWords);
    setFavorites(new Set(getFavorites()));

    const handleFavoritesChanged = () => {
      setFavorites(new Set(getFavorites()));
    };
    window.addEventListener('favorites_changed', handleFavoritesChanged);

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('favorites_changed', handleFavoritesChanged);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = allWords.filter(w => 
      w.word.toLowerCase().includes(lowerQuery) || 
      w.meanings.some(m => m.toLowerCase().includes(lowerQuery))
    ).slice(0, 20); // Limit to 20 results for performance
    
    setResults(filtered);
  }, [query, allWords]);

  const handleToggleFavorite = (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = toggleFavorite(wordId);
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFav) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
  };

  const playAudio = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanWord = word.replace(/[^a-zA-Z\s-]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en-') && !v.localService) || 
                           voices.find(v => v.lang.startsWith('en-'));
      if (englishVoice) utterance.voice = englishVoice;
      (window as any)._currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full mb-6 z-30">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="搜索单词或中文意思..."
          className="w-full bg-white border border-[#E5E0D8] rounded-xl pl-10 pr-10 py-3 text-sm font-medium text-[#5C4B41] focus:outline-none focus:ring-2 focus:ring-[#F4A261] shadow-sm transition-shadow"
        />
        <SearchIcon className="w-5 h-5 text-[#A89F91] absolute left-3 top-1/2 -translate-y-1/2" />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89F91] hover:text-[#5C4B41] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isFocused && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E0D8] rounded-xl shadow-lg max-h-[60vh] overflow-y-auto hide-scrollbar">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map(word => {
                const isFav = favorites.has(word.id);
                return (
                  <div key={word.id} className="px-4 py-3 border-b border-[#E5E0D8] last:border-0 hover:bg-[#FAF8F5] transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="text-base font-bold text-[#5C4B41]">{word.word}</h4>
                        <p className="text-xs text-[#A89F91] font-mono">{word.phonetic}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => handleToggleFavorite(word.id, e)}
                          className={`p-1.5 rounded-full transition-colors ${isFav ? 'text-[#E9C46A] hover:bg-yellow-50' : 'text-[#D5CFC4] hover:bg-[#E5E0D8]'}`}
                        >
                          <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={(e) => playAudio(word.word, e)}
                          className="text-[#F4A261] p-1.5 hover:bg-[#E5E0D8] rounded-full transition-colors"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-[#5C4B41]">{word.meanings.join('; ')}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#E5E0D8] text-[#A89F91] text-[10px] rounded uppercase tracking-wider">
                      {word.category}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-[#A89F91]">
              <p>未找到匹配的单词</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
