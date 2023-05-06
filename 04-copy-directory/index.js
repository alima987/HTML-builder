const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'files-copy');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const filesDir = path.join(__dirname, 'files');
fs.readdir(filesDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const srcFile = path.join(filesDir, file);
    const destFile = path.join(dir, file);
    fs.copyFileSync(srcFile, destFile);
  });
});
