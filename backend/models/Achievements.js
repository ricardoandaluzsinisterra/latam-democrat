const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  year: Number,
  category: {
    type: String,
    enum: ['Technology', 'Governance', 'Culture', 'Science', 'Agriculture', 'Art'],
    required: true
  },
  description: String,
  imageUrl: String, // From Cloudinary
  imageCloudinaryId: String,
  globalImpact: String,
  innovators: [String],
  legacy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', achievementSchema);
