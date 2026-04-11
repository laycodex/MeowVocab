import { Word, getWords } from '../data/words';

export interface ReviewData {
  wordId: string;
  nextReview: number; // timestamp
  interval: number; // days
  ease: number; // ease factor
  repetitions: number;
}

export const getProgress = (): Record<string, ReviewData> => {
  try {
    const data = localStorage.getItem('vocab_progress');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse progress', e);
    return {};
  }
};

export const saveProgress = (progress: Record<string, ReviewData>) => {
  try {
    localStorage.setItem('vocab_progress', JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const getDailyCount = (): { date: string; count: number } => {
  try {
    const data = localStorage.getItem('vocab_daily');
    const today = new Date().toISOString().split('T')[0];
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.date === today) return parsed;
    }
    return { date: today, count: 0 };
  } catch (e) {
    const today = new Date().toISOString().split('T')[0];
    return { date: today, count: 0 };
  }
};

export const incrementDailyCount = () => {
  const current = getDailyCount();
  const today = new Date().toISOString().split('T')[0];
  const newCount = current.date === today ? current.count + 1 : 1;
  try {
    localStorage.setItem('vocab_daily', JSON.stringify({ date: today, count: newCount }));
  } catch (e) {
    console.error('Failed to save daily count', e);
  }
  return newCount;
};

export const getFavorites = (): string[] => {
  try {
    const data = localStorage.getItem('vocab_favorites');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleFavorite = (wordId: string): boolean => {
  const favs = new Set(getFavorites());
  let isFav = false;
  if (favs.has(wordId)) {
    favs.delete(wordId);
  } else {
    favs.add(wordId);
    isFav = true;
  }
  try {
    localStorage.setItem('vocab_favorites', JSON.stringify(Array.from(favs)));
    window.dispatchEvent(new Event('favorites_changed'));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
  return isFav;
};

export const exportAllData = () => {
  return {
    progress: getProgress(),
    daily: getDailyCount(),
    favorites: getFavorites(),
  };
};

export const importAllData = (rawData: any) => {
  if (!rawData) return;
  
  let data = rawData;
  // Handle case where backend returns stringified JSON
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse imported data', e);
      return;
    }
  }
  
  // Handle case where backend wraps data in another 'data' property
  if (data.data && !data.progress && !data.daily && !data.favorites) {
    data = data.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
  }

  if (data.progress) localStorage.setItem('vocab_progress', typeof data.progress === 'string' ? data.progress : JSON.stringify(data.progress));
  if (data.daily) localStorage.setItem('vocab_daily', typeof data.daily === 'string' ? data.daily : JSON.stringify(data.daily));
  if (data.favorites) localStorage.setItem('vocab_favorites', typeof data.favorites === 'string' ? data.favorites : JSON.stringify(data.favorites));
  window.dispatchEvent(new Event('favorites_changed'));
};

// Add listener to ensure data is saved when app is backgrounded (crucial for WeChat WebView)
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Force any pending state to be written if we had memory caching
      // Currently we write to localStorage synchronously, so this is just a safeguard
    }
  });
  window.addEventListener('pagehide', () => {
    // Another safeguard for iOS WKWebView
  });
}

// SM-2 Algorithm
export const reviewWord = (wordId: string, quality: number) => {
  // quality: 0 (forgot) to 5 (perfect)
  const progress = getProgress();
  let data = progress[wordId] || {
    wordId,
    nextReview: Date.now(),
    interval: 0,
    ease: 2.5,
    repetitions: 0,
  };

  if (quality < 3) {
    data.repetitions = 0;
    data.interval = 1;
  } else {
    if (data.repetitions === 0) {
      data.interval = 0; // Due immediately for the next review session
    } else if (data.repetitions === 1) {
      data.interval = 1;
    } else {
      data.interval = Math.round(data.interval * data.ease);
    }
    data.repetitions += 1;
  }

  data.ease = data.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (data.ease < 1.3) data.ease = 1.3;

  data.nextReview = Date.now() + data.interval * 24 * 60 * 60 * 1000;
  
  progress[wordId] = data;
  saveProgress(progress);
  incrementDailyCount();
};

export const getDueWords = async (category: string, limit: number = 20, order: 'sequential' | 'random' = 'sequential', excludeIds: string[] = [], mode: 'new' | 'review' | 'all' | 'favorites' = 'all'): Promise<Word[]> => {
  const progress = getProgress();
  const now = Date.now();
  const words = await getWords();
  const favorites = getFavorites();
  
  const categoryWords = words.filter(w => w.category.includes(category));
  
  // Filter words that are due or new, and not in excludeIds
  let dueWords = categoryWords.filter(w => {
    if (excludeIds.includes(w.id)) return false;
    
    if (mode === 'favorites') {
      return favorites.includes(w.id);
    }
    
    const hasProgress = !!progress[w.id];
    const due = progress[w.id]?.nextReview || 0;
    
    if (mode === 'new') {
      return !hasProgress;
    } else if (mode === 'review') {
      return hasProgress && due <= now;
    } else {
      return due <= now;
    }
  });

  if (order === 'random') {
    dueWords = dueWords.sort(() => Math.random() - 0.5);
  } else {
    // Sequential: sort by original index in the words array
    dueWords = dueWords.sort((a, b) => {
      const indexA = words.findIndex(w => w.id === a.id);
      const indexB = words.findIndex(w => w.id === b.id);
      return indexA - indexB;
    });
  }

  return dueWords.slice(0, limit);
};
