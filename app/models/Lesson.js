/**
 * Lesson schema definition.
 * @typedef {Object} LessonDoc
 * @property {string} title - Lesson title
 * @property {number} price - Lesson price
 * @property {ObjectId} cursus - Parent cursus id
 */


const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  videoUrl: String,
  price: { type: Number, required: true },
  cursus: { type: mongoose.Schema.Types.ObjectId, ref: 'Cursus' }
});

module.exports = mongoose.model('Lesson', lessonSchema);