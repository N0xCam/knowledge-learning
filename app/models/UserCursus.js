// app/models/UserCursus.js
const mongoose = require('mongoose');

const userCursusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cursus: { type: mongoose.Schema.Types.ObjectId, ref: 'Cursus', required: true },
  validated: { type: Boolean, default: false }
});

module.exports = mongoose.model('UserCursus', userCursusSchema);
