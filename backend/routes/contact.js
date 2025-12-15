const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message, countryInterest } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message required' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      message,
      countryInterest
    });
    await contact.save();

    // Send confirmation email via SendGrid
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to Democratical - We received your message!',
      html: `
        <h2>Hello ${name}!</h2>
        <p>Thank you for reaching out about <strong>${countryInterest || 'Latin American history'}</strong>.</p>
        <p>We'll get back to you shortly.</p>
        <p>Best regards,<br>Democratical Team</p>
      `
    };

    await sgMail.send(msg);
    contact.emailSent = true;
    await contact.save();

    res.status(201).json({ 
      success: true, 
      message: 'Message submitted and confirmation email sent!' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all contacts (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submitted_at: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
