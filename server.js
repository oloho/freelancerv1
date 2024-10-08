const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const slavePcs = new Map();
const taskQueue = new Map();

app.use(express.json());

app.get('/api/pcs', (req, res) => {
  try {
    const pcsArray = Array.from(slavePcs.values()).map(({ socket, ...pc }) => pc);
    res.json(pcsArray);
  } catch (error) {
    console.error('Error fetching PCs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/pcs/:id/update', (req, res) => {
  try {
    const pcId = req.params.id;
    const pc = slavePcs.get(pcId);
    if (pc && pc.socket) {
      pc.socket.emit('update');
      res.json({ ...pc, status: 'updating' });
    } else {
      res.status(404).json({ error: 'PC not found' });
    }
  } catch (error) {
    console.error('Error updating PC:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/pcs/update-all', (req, res) => {
  try {
    const updatedPcs = [];
    slavePcs.forEach(pc => {
      if (pc.socket) {
        pc.socket.emit('update');
        updatedPcs.push({ ...pc, status: 'updating' });
      } else {
        updatedPcs.push({ ...pc, status: 'offline' });
      }
    });
    res.json(updatedPcs);
  } catch (error) {
    console.error('Error updating all PCs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (rest of the code remains the same)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});