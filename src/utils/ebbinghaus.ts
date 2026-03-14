import { Word, getWords } from '../data/words';

export interface ReviewData {
  wordId: string;
  nextReview: number; // timestamp
  interval: number; // days
  ease: number; // ease factor
  repetitions: number;
}

export const getProgress = (): Record<string, ReviewData> => {
  const data = localStorage.getItem('vocab_progress');
  return data ? JSON.parse(data) : {};
};

export const saveProgress = (progress: Record<string, ReviewData>) => {
  localStorage.setItem('vocab_progress', JSON.stringify(progress));
};

export const getDailyCount = (): { date: string; count: number } => {
  const data = localStorage.getItem('vocab_daily');
  const today = new Date().toISOString().split('T')[0];
  if (data) {
    const parsed = JSON.parse(data);
    if (parsed.date === today) return parsed;
  }
  return { date: today, count: 0 };
};

export const incrementDailyCount = () => {
  const current = getDailyCount();
  const today = new Date().toISOString().split('T')[0];
  const newCount = current.date === today ? current.count + 1 : 1;
  localStorage.setItem('vocab_daily', JSON.stringify({ date: today, count: newCount }));
  return newCount;
};

export const getFavorites = (): string[] => {
  const data = localStorage.getItem('vocab_favorites');
  return data ? JSON.parse(data) : [];
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
  localStorage.setItem('vocab_favorites', JSON.stringify(Array.from(favs)));
  return isFav;
};

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
      data.interval = 1;
    } else if (data.repetitions === 1) {
      data.interval = 6;
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

export const getDueWords = async (category: string, limit: number = 20, order: 'sequential' | 'random' = 'sequential', excludeIds: string[] = [], mode: 'new' | 'review' | 'all' = 'all'): Promise<Word[]> => {
  const progress = getProgress();
  const now = Date.now();
  const words = await getWords();
  
  const categoryWords = words.filter(w => w.category.includes(category));
  
  // Filter words that are due or new, and not in excludeIds
  let dueWords = categoryWords.filter(w => {
    if (excludeIds.includes(w.id)) return false;
    
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
