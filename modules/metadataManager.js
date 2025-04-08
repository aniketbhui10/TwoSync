// metadataManager.js
const fs = require('fs');
const path = require('path');
const metadataFile = path.join(__dirname, 'metadata.json');

function loadMetadata() {
  if (!fs.existsSync(metadataFile)) {
    return {};
  }
  const data = fs.readFileSync(metadataFile, 'utf-8');
  return JSON.parse(data);
}

function saveMetadata(metadata) {
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
}

function updateFileMetadata(eventType, filePath, hash, timestamp) {
  const metadata = loadMetadata();
  metadata[filePath] = { event: eventType, hash, lastModified: timestamp };
  saveMetadata(metadata);
  console.log(`Metadata updated for ${filePath}`);
}

module.exports = { loadMetadata, saveMetadata, updateFileMetadata };
