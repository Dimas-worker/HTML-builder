const fs = require('fs');
const path = require('path');

const {readdir, rm} = require('fs/promises');

let pathStyle = path.join(__dirname, 'styles');
let pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function copyStyleInBundle(pathStyle, pathBundle) {
  try {
    await rm(pathBundle, {force: true});
    const output = fs.createWriteStream(pathBundle);
    const filesAtFolder = await readdir(pathStyle, {withFileTypes: true});
    for (let file of filesAtFolder) {
      if (file.isFile()) {
        const ext = path.extname(path.join(__dirname, 'styles', file.name))
        if (ext === '.css') {
          const input = fs.createReadStream(path.join(__dirname, 'styles', file.name));
          input.pipe(output)
        }
      }
    } 
  } catch (err) {
    console.error(err);
  }
};
copyStyleInBundle(pathStyle, pathBundle)
