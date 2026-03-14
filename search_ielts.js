import https from 'https';

const options = {
  hostname: 'api.github.com',
  path: '/repos/Hazrat-Ali9/SAT-GRE-GMAT-TOFEL-PTE-ACT-DET/contents',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.map(i => i.name));
    } catch (e) {
      console.error(e);
    }
  });
});
