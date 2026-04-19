import fs from 'fs/promises';
import path from 'path';

async function main() {
  const files = ['words_cet4.json', 'words_cet6.json', 'words_kaoyan.json', 'words_toefl.json', 'words_sat.json', 'words_part1.json', 'words_part2.json'];
  
  for (const file of files) {
    const p = path.join(process.cwd(), 'src/data', file);
    try {
        const data = JSON.parse(await fs.readFile(p));
        for (const w of data) {
           if (w.phonetic) {
               w.phonetic = w.phonetic.replace(/ә/g, 'ə');
               w.phonetic = w.phonetic.replace(/\./g, ', ');
               // Add slashes if missing 
               if (!w.phonetic.startsWith('/') && w.phonetic.length > 0) {
                 w.phonetic = `/${w.phonetic}/`;
               }
           }
        }
        await fs.writeFile(p, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error on', file, e.message);
    }
  }
}

main();
