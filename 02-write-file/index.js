const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createWriteStream('input.txt', { flags: 'a' });
console.log('Введите текст. Для выхода введите "exit" или нажмите Ctrl + C\n');

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
prompt: '',
});

rl.prompt();

rl.on('line', (line) => {

if (line.trim().toLowerCase() === 'exit') {

console.log('Программа завершена');
process.exit(0);
}


fileStream.write(`${line}\n`);

rl.prompt();
}).on('close', () => {

console.log('Программа завершена');
});

