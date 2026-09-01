const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'matched', 'resolved'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);