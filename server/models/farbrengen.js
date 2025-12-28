const mongoose = require('mongoose');

const farbrengenSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  zoomLink: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Farbrengen', farbrengenSchema); 