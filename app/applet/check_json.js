import fs from 'fs';
const data = fs.readFileSync('src/data/words_toefl.json', 'utf8');
if (data.includes("\\'")) {
    console.log("Yes, it includes escaped single quotes");
} else {
    console.log("No");
}
