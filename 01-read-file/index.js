const fs = require('fs') // подключение модлуя fs
const path = require('path'); // подключение модуля path
const { stdout } = process;

const stream = fs.createReadStream(path.join(__dirname, "text.txt"), 'utf-8');
stream.once('data', (data) => {
  const str = (typeof data === 'string') ? data.trim() : data.toString().trim();
  stdout.write(`${str}`);
})
