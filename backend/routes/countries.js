const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Get all countries
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find().populate('achievements');
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single country
router.get('/:id', async (req, res) => {
  try {
    const country = await Country.findById(req.params.id).populate('achievements');
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json(country);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create country
router.post('/', async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update country
router.put('/:id', async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(country);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
