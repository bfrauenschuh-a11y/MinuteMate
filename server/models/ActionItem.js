const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now }
});

const ActionItemSchema = new mongoose.Schema({
  number: Number,
  category: String,
  description: String,
  comments: [CommentSchema],
  status: { type: String, enum: ['open', 'in progress', 'completed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  responsible: [String],
  dueDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  attachments: [String],
  completedAt: Date
});

ActionItemSchema.index({ description: 'text', category: 'text' });

module.exports = mongoose.model('ActionItem', ActionItemSchema);
