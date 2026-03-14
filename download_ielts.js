import https from 'https';
import fs from 'fs';

const url = 'https://raw.githubusercontent.com/arielxq/WORDS/main/data/vocabulary.json';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('src/data/ielts_words.json', data);
    console.log('Downloaded ielts_words.json');
  });
});
