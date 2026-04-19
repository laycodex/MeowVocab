import fs from 'fs';
const toefl = JSON.parse(fs.readFileSync('src/data/words_toefl.json'));
const p1 = toefl.slice(0, 7000);
const p2 = toefl.slice(7000);
fs.writeFileSync('src/data/words_toefl_1.json', JSON.stringify(p1, null, 2));
fs.writeFileSync('src/data/words_toefl_2.json', JSON.stringify(p2, null, 2));
// Also remove the original file so it doesn't get synced
fs.unlinkSync('src/data/words_toefl.json');
console.log('Split into', p1.length, 'and', p2.length);
