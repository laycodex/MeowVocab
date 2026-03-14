import fs from 'fs';

const content = fs.readFileSync('src/data/all_words.json', 'utf8');

// Find the last complete object
const lastValidIndex = content.lastIndexOf('},');
if (lastValidIndex !== -1) {
  const fixedContent = content.substring(0, lastValidIndex + 1) + '\n]';
  fs.writeFileSync('src/data/all_words.json', fixedContent);
  console.log('Fixed all_words.json');
} else {
  console.log('Could not find last valid object');
}
