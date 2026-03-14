import https from 'https';

const options = {
  hostname: 'api.github.com',
  path: '/search/repositories?q=gre+words+json',
  headers: { 'User-Agent': 'Node.js' }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(json.items.slice(0, 5).map(i => i.html_url));
  });
});
