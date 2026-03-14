import fs from 'fs';

const greRaw = fs.readFileSync('src/data/gre_words.json', 'utf8');
const greFixed = greRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
const greData = JSON.parse(greFixed);

const ieltsRaw = fs.readFileSync('src/data/ielts_words.json', 'utf8');
const ieltsFixed = ieltsRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
const ieltsData = JSON.parse(ieltsFixed);

const toeflData = JSON.parse(fs.readFileSync('src/data/toefl_words.json', 'utf8'));
const satData = JSON.parse(fs.readFileSync('src/data/sat_words.json', 'utf8'));

const wordsMap = new Map();

function addWord(word, phonetic, meanings, category) {
  if (!word) return;
  const lowerWord = word.toLowerCase();
  if (wordsMap.has(lowerWord)) {
    const existing = wordsMap.get(lowerWord);
    if (!existing.categories.includes(category)) {
      existing.categories.push(category);
    }
  } else {
    wordsMap.set(lowerWord, {
      word: lowerWord,
      phonetic: phonetic || '',
      meanings: meanings || [],
      categories: [category]
    });
  }
}

// Process GRE
if (greData.words) {
  for (const item of greData.words) {
    addWord(item.word, '', [item.meaning], 'GRE');
  }
}

// Process IELTS
for (const categoryKey in ieltsData) {
  const category = ieltsData[categoryKey];
  if (category.words) {
    for (const group of category.words) {
      for (const item of group) {
        if (item.word && item.word[0]) {
          addWord(item.word[0], '', [`${item.pos || ''} ${item.meaning}`.trim()], 'IELTS');
        }
      }
    }
  }
}

// Process TOEFL
for (const item of toeflData) {
  const meanings = (item.translations || []).map(t => `${t.type ? t.type + '. ' : ''}${t.translation}`);
  addWord(item.word, '', meanings, 'TOEFL');
}

// Process SAT
for (const item of satData) {
  const meanings = (item.translations || []).map(t => `${t.type ? t.type + '. ' : ''}${t.translation}`);
  addWord(item.word, '', meanings, 'SAT');
}

const words = Array.from(wordsMap.values()).map((w, index) => ({
  id: `w${index + 1}`,
  word: w.word,
  phonetic: w.phonetic,
  meanings: w.meanings,
  category: w.categories.join(', ') // e.g., "GRE, TOEFL"
}));

fs.writeFileSync('src/data/all_words.json', JSON.stringify(words, null, 2));
console.log(`Generated ${words.length} unique words.`);
