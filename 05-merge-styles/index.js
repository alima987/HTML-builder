const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(distDir, 'bundle.css');
const styles = [];

fs.readdir(stylesDir, (err, files) => {
  if (err) throw err;


  files.forEach((file) => {
    const filePath = path.join(stylesDir, file);
    
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;

      if (stats.isFile() && path.extname(filePath) === '.css') {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) throw err;
      
          styles.push(data);

          if (styles.length === files.length) {
            fs.writeFile(bundleFilePath, styles.join(''), (err) => {
              if (err) throw err;
              console.log('Styles bundled successfully!');
            });
          }
        });
      }
    });
  });
});
