const fs = require('fs');
const path = require('path');

const {readdir, stat} = require('fs/promises');

let secretFolderPath = path.join(__dirname, 'secret-folder');

async function getInfoForFolder(track) {
  try {
    const files = await readdir(track, {withFileTypes: true});
    for (let file of files) {
      if (file.isFile()) {
        const info = await stat(path.join(track, file.name));
        const ext = path.extname(path.join(track, file.name))
        const fileName = file.name.slice(0, -ext.length);
        console.log(`${fileName} - ${ext.slice(1)} - ${info.size}b`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
getInfoForFolder(secretFolderPath);
