// conflictResolver.js
// Simple conflict detection: if file hashes differ then there is a conflict.
function detectConflict(localMeta, remoteMeta) {
    return localMeta.hash !== remoteMeta.hash;
  }
  
  // Automated resolution: "last modified wins"
  function resolveConflict(localMeta, remoteMeta) {
    if (new Date(localMeta.lastModified) >= new Date(remoteMeta.lastModified)) {
      console.log("Automated resolution: Local version wins.");
      return 'local';
    } else {
      console.log("Automated resolution: Remote version wins.");
      return 'remote';
    }
  }
  
  module.exports = { detectConflict, resolveConflict };
  