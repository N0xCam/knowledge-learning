const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: String
});

module.exports = mongoose.model('Theme', themeSchema);
