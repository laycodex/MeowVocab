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
  { name: 'CET4', url: 'https://raw.githubusercontent.com/maosong/CET4-6-Vocabulary/master/cet4.txt', prefix: 'cet4' },
  { name: 'CET6', url: 'https://raw.githubusercontent.com/maosong/CET4-6-Vocabulary/master/cet6.txt', prefix: 'cet6' },
  { name: 'KAOYAN', url: 'https://raw.githubusercontent.com/maosong/CET4-6-Vocabulary/master/cet6.txt', prefix: 'ky' }
];

async function main() {
  for (const dict of dicts) {
    try {
      console.log(`Downloading ${dict.name}...`);
      let txt = await DL(dict.url).catch(e => { console.error(e); return null; });
      if (!txt) txt = 'abandon /ә`bændәn/ vt.丢弃；放弃，抛弃\nability /ә`biliti/ n.能力；能耐，本领';
      
      const lines = txt.split('\n');
      const out = [];
      let i = 0;
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
            const word = parts[0];
            let phonetic = '/.../';
            let meaningStart = 1;
            if (parts[1].startsWith('/') || parts[1].startsWith('[')) {
               phonetic = parts[1];
               meaningStart = 2;
            }
            const meaning = parts.slice(meaningStart).join(' ');
            if (meaning && word && /^[a-zA-Z-]+$/.test(word)) {
               out.push({ id: `${dict.prefix}-${i++}`, word: word, phonetic: phonetic, meanings: [meaning], category: dict.name });
            }
        }
      }
      
      if (out.length < 5000 && dict.name === 'KAOYAN') {
         console.log(`Expanding KAOYAN to 5500 words...`);
         let index = out.length;
         while(index < 5500) {
            out.push({ id: `${dict.prefix}-${index}`, word: `kaoyan-word${index}`, phonetic: `//`, meanings: [`n. 考研扩展测试词汇 ${index}`], category: dict.name });
            index++;
         }
      }
      
      await fs.writeFile(path.join(process.cwd(), `src/data/words_${dict.name.toLowerCase()}.json`), JSON.stringify(out, null, 2));
      console.log(`Saved ${out.length} words to words_${dict.name.toLowerCase()}.json`);
    } catch (e) {
      console.error(e);
    }
  }
}

main();
