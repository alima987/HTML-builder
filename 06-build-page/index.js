const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const STYLES = path.join(__dirname,'styles');
const ASSETS = path.join(__dirname,'assets');
const PROJECT_DIST = path.join(__dirname,'project-dist');
const TEMPLATE = path.join(__dirname,'template.html');
const COMPONENTS = path.join(__dirname,'components');
const BUNDLE = path.join(PROJECT_DIST,'style.css');
const COPY_ASSETS = path.join(PROJECT_DIST,'assets');
const INDEX = path.join(PROJECT_DIST,'index.html');


const unlink = async (pathToFile) => {
  await fs.unlink(pathToFile, (err) => {
    if (err) throw err;
  });
};

const rm = async (path) => {
  await fs.readdir(path, {withFileTypes: true}, async (err, files) => {
    if (!err) {
      for (const file of files) {
        const pathToFile = `${path}/${file.name}`;
        await fs.stat(pathToFile, async (err, stats) => {
          if (stats.isFile()) {
            await unlink(pathToFile);
          } else {
            await rm(pathToFile);
          }
        });
      }
    }
  });
};


const mkdir = async (folderPath) => {
  await fs.mkdir(folderPath, {recursive: true}, (err) => {
    if (err) throw err;
  });
};

const copyFile = async (pathToFile, newPathToFile) => {
  await fs.copyFile(pathToFile, newPathToFile, (err) => {
    if (err) throw err;
  });
};

const copyDirectory = async (folderPath, copyFolderPath) => {
  await mkdir(copyFolderPath);

  await fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(async (file) => {
        const pathToFile = `${folderPath}/${file.name}`;
        const newPathToFile = `${copyFolderPath}/${file.name}`;
        await fs.stat(pathToFile, async (err, stats) => {
          if (stats.isFile()) {
            await copyFile(pathToFile, newPathToFile);
          } else {
            await copyDirectory(pathToFile, newPathToFile);
          }
        });
      });
    }
  });
};


const generateHtml = async (extPath, TEMPLATE, COMPONENTS) => {
  const writeableStream = fs.createWriteStream(extPath);

  let extHtml = await fsPromises.readFile(TEMPLATE, 'utf-8');

  const files =  await fsPromises.readdir(COMPONENTS);
  for (const file of files) {
    const pathToFile = `${COMPONENTS}/${file}`;
    const {name, ext} = path.parse(pathToFile);
    if (ext === '.html') {
      const stats = await fsPromises.stat(pathToFile);
      if (stats.isFile()) {
        const data = await fsPromises.readFile(pathToFile, 'utf-8');
        extHtml = extHtml.replace(`{{${name}}}`, data);
      }
    }
  }
  writeableStream.write(`${extHtml}`);
};

const generateBundle = async (folderPath, bundlePath) => {
  const writeableStream = fs.createWriteStream(bundlePath);
  await fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        const pathToFile = `${folderPath}/${file.name}`;
        const {ext} = path.parse(pathToFile);
        if (ext === '.css') {
          fs.stat(pathToFile, (err, stats) => {
            if (stats.isFile()) {
              const stream = new fs.ReadStream(pathToFile);
              stream.on('readable', () => {
                const data = stream.read();
                if (data != null) writeableStream.write(`${data}\n`);
              });
            }
          });
        }
      });
    }
  });
};

(async () => {
  await mkdir(PROJECT_DIST);
  await rm(COPY_ASSETS);
  await copyDirectory(ASSETS, COPY_ASSETS);
  await generateBundle(STYLES, BUNDLE);
  await generateHtml(INDEX, TEMPLATE, COMPONENTS);
})();