const fs = require('fs');
const path = require('path'); 
const { stdin: input, stdout: output } = require('process');

fs.createWriteStream(path.join(__dirname, 'input.txt'));

output.write('please, enter some text\n');

input.on('data', (data) => {

  if (data.toString().trim().toLowerCase() === 'exit') { process.exit() };

  fs.appendFile(path.join(__dirname,'input.txt'), `${data}`, err => { if (err) throw err} );
  
  output.write("enter other text or 'exit'\n");

});
process.on('SIGINT', () => { process.exit() });

process.on('exit', () => output.write('Bye and Good luck!'));