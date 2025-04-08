// main.js
const path = require('path');
const fs = require('fs');

// ✅ Corrected import paths
const { watchFolder, getFileHash } = require('./modules/fileWatcher');
const { updateFileMetadata, loadMetadata } = require('./modules/metadataManager');
const { detectConflict, resolveConflict } = require('./modules/conflictorResolver');
const { setupServer, setupClient } = require('./modules/communication');

const folderToWatch = path.join(__dirname, 'watched_folder');
const PORT = 3000;

// Ensure the folder exists
if (!fs.existsSync(folderToWatch)) {
  fs.mkdirSync(folderToWatch);
}

// Set up a communication server (run this on one machine)
setupServer(PORT);

// Optionally, set up a client to connect to an existing server:
// const socket = setupClient("http://localhost:3000");

// Callback to handle file events from fileWatcher
async function onFileChange(eventType, filePath) {
  try {
    let hash = null;
    if (eventType !== 'delete') {
      hash = await getFileHash(filePath);
    }
    const timestamp = new Date().toISOString();

    // Update local metadata
    updateFileMetadata(eventType, filePath, hash, timestamp);

    // Simulate remote metadata for conflict detection.
    const metadata = loadMetadata();
    const localMeta = metadata[filePath];
    const remoteMeta = metadata[filePath + "_remote"] || localMeta; // for simulation

    if (detectConflict(localMeta, remoteMeta)) {
      const winner = resolveConflict(localMeta, remoteMeta);
      console.log(`Conflict resolved in favor of: ${winner}`);
      // TODO: Implement backup and update logic based on winner.
    }

    // Broadcast update to remote nodes (uncomment if socket is set up):
    // socket.emit('file-update', { eventType, filePath, hash, timestamp });

  } catch (error) {
    console.error("Error handling file event:", error);
  }
}

// Start watching the designated folder
watchFolder(folderToWatch, onFileChange);
console.log("Watching folder:", folderToWatch);
