const fs = require('fs');
const path = require('node:path');

const pathToText = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToText, 'utf-8');
readStream.on('data', (chunk) => {
  console.log(chunk);
});
  
readStream.on('error', (error) => {
  throw error;
});