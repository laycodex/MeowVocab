export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  category: string;
}

// Memory cache to prevent reloading the same dictionaries
const cache: Record<string, Word[]> = {};

export const getWords = async (): Promise<Word[]> => {
  throw new Error("getWords() should now rely on getWordsByCategory() or getAllWords()");
};

export const getAllWords = async (): Promise<Word[]> => {
  const categories = ['CET4', 'CET6', 'KAOYAN', 'TOEFL', 'SAT', 'IELTS'];
  let allWords: Word[] = [];
  for (const cat of categories) {
    const words = await getWordsByCategory(cat);
    allWords = allWords.concat(words);
  }
  return allWords;
};

export const getWordsByCategory = async (category: string): Promise<Word[]> => {
  if (cache[category]) return cache[category];

  let rawData: any;
  try {
    switch (category) {
      case 'CET4':
        rawData = (await import('./words_cet4.json')).default;
        break;
      case 'CET6':
        rawData = (await import('./words_cet6.json')).default;
        break;
      case 'KAOYAN':
        rawData = (await import('./words_kaoyan.json')).default;
        break;
      case 'TOEFL':
        rawData = (await import('./words_toefl.json')).default;
        break;
      case 'SAT':
        rawData = (await import('./words_sat.json')).default;
        break;
      case 'IELTS':
      case 'GRE':
      default:
        // Fallback for IELTS, GRE which remain in parts 1 & 2 for now
        const p1 = (await import('./words_part1.json')).default;
        const p2 = (await import('./words_part2.json')).default;
        rawData = [...p1, ...p2];
        break;
    }
    
    // Store in cache
    cache[category] = rawData as Word[];
    return cache[category];
  } catch (error) {
    console.error(`Failed to load words for category ${category}:`, error);
    return [];
  }
};

export const quotes = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "You are never too old to set another goal or to dream a new dream.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.",
  "I learned that courage was not the absence of fear, but the triumph over it.",
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "You don't have to be great to start, but you have to start to be great.",
  "Every day is a second chance.",
  "Fall seven times, stand up eight."
];
