const fs = require('fs')
const path = require('node:path');
const pathToText = path.join(__dirname, 'text.txt');
fs.readFile(pathToText, 'utf-8', (error, data) => {
    if (error) throw error;
 else console.log(data);
});