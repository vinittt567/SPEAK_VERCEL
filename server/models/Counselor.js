const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  specialty: [{
    type: String,
    enum: ['Stress', 'Anxiety', 'Career'],
    required: true
  }],
  languages: [{
    type: String,
    required: true
  }],
  mode: {
    type: String,
    enum: ['Online', 'In-person', 'Both'],
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Full', 'Online only'],
    default: 'Available'
  },
  platform: {
    type: String,
    enum: ['Google Meet', 'Zoom'],
    required: true
  },
  meetLink: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalSessions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Counselor', counselorSchema);