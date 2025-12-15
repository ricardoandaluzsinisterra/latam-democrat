const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  countryInterest: String,
  message: { type: String, required: true },
  subject: String,
  emailSent: { type: Boolean, default: false },
  submitted_at: { type: Date, default: Date.now },
  response_sent: Boolean,
  notes: String
});

module.exports = mongoose.model('Contact', contactSchema);
