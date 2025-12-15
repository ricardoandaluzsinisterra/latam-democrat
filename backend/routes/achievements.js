const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');

// Get all achievements (with optional filters)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.country) filters.country = req.query.country;
    if (req.query.category) filters.category = req.query.category;
    
    const achievements = await Achievement.find(filters).populate('country');
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create achievement
router.post('/', async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
