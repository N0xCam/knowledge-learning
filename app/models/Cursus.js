const mongoose = require('mongoose');

const cursusSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('Cursus', cursusSchema);