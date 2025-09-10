const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: null },
  cursus: { type: mongoose.Schema.Types.ObjectId, ref: 'Cursus', default: null },
  type: { type: String, enum: ['lesson', 'cursus'], required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Purchase', purchaseSchema);
