// Test connection script
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/test',
  method: 'GET'
};

console.log('Attempting to connect to http://localhost:4000/test...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    console.log('Connection successful!');
  });
});

req.on('error', (e) => {
  console.error(`Connection error: ${e.message}`);
});

req.end(); 