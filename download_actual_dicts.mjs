import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const DL = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode !== 200) {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return DL(res.headers.location).then(resolve).catch(reject);
      }
      reject(new Error(`Failed to GET ${url}: ${res.statusCode}`));
      return;
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const dicts = [
  { name: 'CET4', url: 'https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/3-CET4-%E9%A1%BA%E5%BA%8F.json', prefix: 'cet4' },
  { name: 'CET6', url: 'https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/4-CET6-%E9%A1%BA%E5%BA%8F.json', prefix: 'cet6' },
  { name: 'KAOYAN', url: 'https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/5-%E8%80%83%E7%A0%94-%E9%A1%BA%E5%BA%8F.json', prefix: 'ky' },
  { name: 'TOEFL', url: 'https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/6-%E6%89%98%E7%A6%8F-%E9%A1%BA%E5%BA%8F.json', prefix: 'toefl' },
  { name: 'SAT', url: 'https://raw.githubusercontent.com/KyleBing/english-vocabulary/master/json/7-SAT-%E9%A1%BA%E5%BA%8F.json', prefix: 'sat' }
];

async function main() {
  for (const dict of dicts) {
    try {
      console.log(`Downloading ${dict.name}...`);
      const txt = await DL(dict.url);
      const data = JSON.parse(txt);
      
      const out = [];
      let i = 0;
      for (const item of data) {
        if (!item.word) continue;
        
        // phonetics are missing in some, default to empty or / /
        const phonetic = item.phonetic ? `/${item.phonetic}/` : `/ /`;
        
        let meanings = [];
        if (item.translations && Array.isArray(item.translations)) {
          meanings = item.translations.map(t => `${t.type ? t.type + '. ' : ''}${t.translation}`);
        } else if (item.translation) {
          meanings = [item.translation];
        } else {
            continue; // Skip if no meaning
        }
        
        out.push({
          id: `${dict.prefix}-${i++}`,
          word: item.word,
          phonetic: phonetic,
          meanings: meanings,
          category: dict.name
        });
      }
      
      await fs.writeFile(path.join(process.cwd(), `src/data/words_${dict.name.toLowerCase()}.json`), JSON.stringify(out, null, 2));
      console.log(`Saved ${out.length} words to words_${dict.name.toLowerCase()}.json`);
    } catch (e) {
      console.error(`Error for ${dict.name}:`, e.message);
    }
  }
}

main();
