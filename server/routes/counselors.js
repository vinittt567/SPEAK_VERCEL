const express = require('express');
const router = express.Router();
const Counselor = require('../models/Counselor');

// Get all counselors
router.get('/', async (req, res) => {
  try {
    const counselors = await Counselor.find({ status: { $ne: 'Inactive' } });
    res.json(counselors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get counselor by ID
router.get('/:id', async (req, res) => {
  try {
    const counselor = await Counselor.findOne({ id: req.params.id });
    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found' });
    }
    res.json(counselor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new counselor (admin only)
router.post('/', async (req, res) => {
  try {
    const counselor = new Counselor(req.body);
    await counselor.save();
    res.status(201).json(counselor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update counselor
router.put('/:id', async (req, res) => {
  try {
    const counselor = await Counselor.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found' });
    }
    res.json(counselor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Seed initial data
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data
    await Counselor.deleteMany({});
    
    // Insert seed data
    const seedData = [
      {
        id: "counsellor_1",
        name: "Dr. Sharma",
        specialty: ["Stress", "Anxiety"],
        languages: ["English", "Hindi"],
        mode: "Both",
        status: "Available",
        platform: "Google Meet",
        meetLink: "https://meet.google.com/wkv-wsst-pdy",
        bio: "Experienced psychologist specializing in stress and anxiety management.",
        rating: 4.8,
        totalSessions: 150
      },
      {
        id: "counsellor_2",
        name: "Dr. Singh",
        specialty: ["Career", "Anxiety"],
        languages: ["English", "Punjabi"],
        mode: "Online",
        status: "Available",
        platform: "Google Meet",
        meetLink: "https://meet.google.com/dqc-uwht-jph",
        bio: "Career counselor with expertise in professional development.",
        rating: 4.9,
        totalSessions: 200
      },
      {
        id: "counsellor_3",
        name: "Dr. Priya Mehta",
        specialty: ["Stress", "Career"],
        languages: ["English", "Hindi", "Gujarati"],
        mode: "Both",
        status: "Available",
        platform: "Zoom",
        meetLink: "https://zoom.us/j/9876543210",
        bio: "Holistic approach to mental health and career guidance.",
        rating: 4.7,
        totalSessions: 120
      },
      {
        id: "counsellor_4",
        name: "Dr. Rajesh Kumar",
        specialty: ["Anxiety"],
        languages: ["English", "Hindi", "Tamil"],
        mode: "In-person",
        status: "Full",
        platform: "Google Meet",
        meetLink: "https://meet.google.com/abc-def-ghi",
        bio: "Specialist in anxiety disorders and panic management.",
        rating: 4.6,
        totalSessions: 180
      }
    ];
    
    await Counselor.insertMany(seedData);
    res.json({ message: 'Seed data inserted successfully', count: seedData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;