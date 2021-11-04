const fs = require('fs');
const path = require('path');
const { readFile, readdir, mkdir, rmdir , copyFile, rm} = require('fs/promises');

let newFolder = path.join(__dirname, 'project-dist');
let pathTemp = path.join(__dirname, 'template.html');
let pathComp = path.join(__dirname, 'components');
let pathIndex = path.join(__dirname, 'project-dist', 'index.html');

async function getIndexAtProject(pathTemp, pathIndex) {
  const obj = {};
  try {
    const outIndex = fs.createWriteStream(pathIndex);
    const text = await readFile(pathTemp, 'utf-8');
    const filesAtFolder = await readdir(pathComp, {withFileTypes: true});
    for (let file of filesAtFolder) {
      if (file.isFile()) {
        const ext = path.extname(path.join(__dirname, 'components', file.name));
        if (ext === '.html') {
          const fileName = file.name.slice(0, -ext.length);
          const res = await readFile(path.join(__dirname, 'components', file.name), 'utf-8');
          obj[fileName] = res;
        }
      }
    }
    let str = text.replace(/{{(.*)}}/g, (string) => {
      let str = string.slice(2, -2);
      return obj[str] ? obj[str] : '';
    });
    outIndex.write(str);
  }
  catch (err) { 
    console.error(err);
  }
}


let pathDir = path.join(__dirname, 'assets');
let pathNewDir = path.join(__dirname, 'project-dist', 'assets');

async function copyDir(pathDir, pathNewDir) {
  try {
    await rmdir(pathNewDir, { recursive: true});
    await mkdir(pathNewDir, {recursive: true});
    const filesAtFolder = await readdir(pathDir, {withFileTypes: true});
    for (let file of filesAtFolder) {
      let inDir = path.join(pathDir, file.name);
      let outDir = path.join(pathNewDir, file.name);
      if (file.isFile()) {
        await copyFile(inDir, outDir);
      } else {
        copyDir(inDir, outDir);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

let pathStyleIn = path.join(__dirname, 'styles');
let pathStyleOut = path.join(__dirname, 'project-dist', 'style.css');

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

async function getBundle() {
  await rmdir(newFolder, { recursive: true});
  await mkdir(newFolder, {recursive: true});

  copyStyleInBundle(pathStyleIn, pathStyleOut);
  getIndexAtProject(pathTemp, pathIndex);
  copyDir(pathDir, pathNewDir);
}
getBundle();