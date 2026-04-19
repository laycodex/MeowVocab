import fs from 'fs/promises';
import path from 'path';

async function main() {
  const files = ['words_cet4.json', 'words_cet6.json', 'words_kaoyan.json', 'words_toefl.json', 'words_sat.json'];
  
  for (const file of files) {
    const p = path.join(process.cwd(), 'src/data', file);
    try {
        const data = JSON.parse(await fs.readFile(p));
        for (const w of data) {
           if (w.phonetic) {
               // Replace Cyrillic 'ә' with Latin 'ə'
               w.phonetic = w.phonetic.replace(/ә/g, 'ə');
               // Replace multiple phonetics dot with comma
               w.phonetic = w.phonetic.replace(/\./g, ', ');
               // If empty phonetic array, set to default
               if (w.phonetic === '/') w.phonetic = '';
           }
        }
        await fs.writeFile(p, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error on', file, e.message);
    }
  }
}

main();
