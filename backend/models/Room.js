const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  createdBy: String,
  isPublic: { type: Boolean, default: true },
});

module.exports = mongoose.model('Room', roomSchema);
