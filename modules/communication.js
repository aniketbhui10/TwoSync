// communication.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

function setupServer(port) {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server);

  io.on('connection', socket => {
    console.log(`New client connected: ${socket.id}`);
    socket.on('file-update', data => {
      console.log("Server received file update:", data);
      // Broadcast update to other clients.
      socket.broadcast.emit('file-update', data);
    });
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  server.listen(port, () => {
    console.log(`Communication server listening on port ${port}`);
  });

  return io;
}

function setupClient(serverUrl) {
  const ioClient = require('socket.io-client');
  const socket = ioClient.connect(serverUrl);

  socket.on('connect', () => {
    console.log(`Connected to server as ${socket.id}`);
  });

  socket.on('file-update', data => {
    console.log("Client received file update:", data);
    // Process incoming file-update messages here.
  });

  return socket;
}

module.exports = { setupServer, setupClient };
