const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distDir, 'bundle.css');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const styles = fs.readdirSync(stylesDir);

const cssStyles = styles.filter((file) => {
  const extension = path.extname(file);
  return extension === '.css';
});

const bundleStream = fs.createWriteStream(bundleFilePath);

cssStyles.forEach((file) => {
  const filePath = path.join(stylesDir, file);
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(bundleStream, { end: false });
  readStream.on('end', () => {

    bundleStream.write('\n');
  });
});

bundleStream.on('finish', () => {
  console.log('All styles are bundled!');
});
