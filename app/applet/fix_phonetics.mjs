import fs from 'fs/promises';
import path from 'path';

async function main() {
  const p1 = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/words_part1.json')));
  const p2 = JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/data/words_part2.json')));
  
  const pMap = {};
  for (const w of [...p1, ...p2]) {
    if (w.phonetic && w.phonetic !== '/ /' && w.phonetic !== '//') {
      pMap[w.word.toLowerCase()] = w.phonetic;
    }
  }

  const files = ['words_cet4.json', 'words_cet6.json', 'words_kaoyan.json', 'words_toefl.json', 'words_sat.json'];
  
  for (const file of files) {
    const p = path.join(process.cwd(), 'src/data', file);
    try {
        const data = JSON.parse(await fs.readFile(p));
        let fixedCount = 0;
        let missing = 0;
        for (const w of data) {
           const lw = w.word.toLowerCase();
           if (pMap[lw]) {
               // The original part1 phonetics look like "ә'beit" without slashes. We wrap them in slashes.
               w.phonetic = `/${pMap[lw]}/`;
               fixedCount++;
           } else {
               // For words without phonetic matching, we could just leave an empty format
               w.phonetic = '';
               missing++;
           }
        }
        await fs.writeFile(p, JSON.stringify(data, null, 2));
        console.log(`Updated ${file}: ${fixedCount} phonetics added, ${missing} still missing`);
    } catch (e) {
        console.error('Error on', file, e);
    }
  }
}

main();
