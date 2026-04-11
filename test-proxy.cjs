const https = require('https');

const options = {
  hostname: '118.25.174.171',
  port: 443,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Host': 'www.meowvocab.site',
    'Content-Type': 'application/json'
  },
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(JSON.stringify({username: 'test', password: 'password'}));
req.end();
