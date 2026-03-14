import https from 'https';
import fs from 'fs';

const url = 'https://raw.githubusercontent.com/vatsalsaglani/gre-vocab/master/words_meanings.json';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('src/data/gre_words.json', data);
    console.log('Downloaded gre_words.json');
  });
});
