const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

router.post('/create', async (req, res) => {
  const { roomId, createdBy } = req.body;
  const room = new Room({ roomId, createdBy });
  await room.save();
  res.json({ msg: 'Room Created' });
});

router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findOne({ roomId });
  if (!room) return res.status(404).json({ msg: 'Room not found' });
  res.json({ msg: ' Room Joined' });
});

module.exports = router;
