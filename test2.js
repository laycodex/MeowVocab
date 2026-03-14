import https from 'https';

const options = {
  hostname: 'api.github.com',
  path: '/repos/vatsalsaglani/gre-vocab/contents',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(json.map(i => i.name));
  });
});
