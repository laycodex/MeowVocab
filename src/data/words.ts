import wordsPart1 from './words_part1.json';
import wordsPart2 from './words_part2.json';

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meanings: string[];
  category: string;
}

let cachedWords: Word[] | null = null;

export const getWords = async (): Promise<Word[]> => {
  if (cachedWords) return cachedWords;
  try {
    cachedWords = [...(wordsPart1 as Word[]), ...(wordsPart2 as Word[])];
    return cachedWords;
  } catch (error) {
    console.error('Failed to load words:', error);
    throw error;
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
