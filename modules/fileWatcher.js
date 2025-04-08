// fileWatcher.js
const chokidar = require('chokidar');
const crypto = require('crypto');
const fs = require('fs');

function getFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', err => reject(err));
  });
}

function watchFolder(folderPath, onFileChange) {
  const watcher = chokidar.watch(folderPath, { persistent: true, ignoreInitial: false });
  
  watcher
    .on('add', filePath => {
      console.log(`File added: ${filePath}`);
      onFileChange('create', filePath);
    })
    .on('change', filePath => {
      console.log(`File changed: ${filePath}`);
      onFileChange('modify', filePath);
    })
    .on('unlink', filePath => {
      console.log(`File deleted: ${filePath}`);
      onFileChange('delete', filePath);
    });
}

module.exports = { watchFolder, getFileHash };
