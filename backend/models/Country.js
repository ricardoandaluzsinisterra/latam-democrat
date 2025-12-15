const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  region: String,
  era: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  imageUrl: String, // From Cloudinary
  imageCloudinaryId: String,
  description: String,
  population: Number,
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  leaders: [String],
  culturalHeritage: String,
  economicSystem: String,
  politicalStructure: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Country', countrySchema);
