// const fs = require('fs');
const path = require('path');

const { copyFile, readdir, mkdir, rmdir } = require('fs/promises');

let pathIn = path.join(__dirname, 'files');
let pathOut = path.join(__dirname, 'files-copy');

async function copyDir(input, output) {
  try {
    await rmdir(output, { recursive: true});
    await mkdir(output, {recursive: true});
    const filesAtFolder = await readdir(input, {withFileTypes: true});
    for (let file of filesAtFolder) {
      let inDir = path.join(input, file.name);
      let outDir = path.join(output, file.name);
      if (file.isFile()) {
        await copyFile(inDir, outDir);
      } 
      else {
        copyDir(inDir, outDir);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
copyDir(pathIn, pathOut)