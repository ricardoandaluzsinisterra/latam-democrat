const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../models/Contact', () => {
  const ContactMock = function (data) {
    Object.assign(this, data);
  };
  ContactMock.prototype.save = jest.fn();
  ContactMock.find = jest.fn();
  return ContactMock;
});

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn(() => {
      return {
        sendMail: jest.fn().mockResolvedValue(true),
      };
    }),
  };
});

const Contact = require('../models/Contact');
const app = require('../server');

describe('Contact API (functional, mocked DB & email)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/contact - returns 400 when required fields missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: '', message: '' }).expect(400);
    expect(res.body.error).toBe('Name, email, and message required');
  });

  test('POST /api/contact - saves contact and sends email', async () => {
    // simulate first save and then save after emailSent toggle
    let saveCalls = 0;
    Contact.prototype.save.mockImplementation(async function () {
      saveCalls += 1;
      if (saveCalls === 1) {
        // first save returns the contact as initially saved
        this._id = new mongoose.Types.ObjectId();
        return this;
      }
      // second save after emailSent
      return this;
    });

    const payload = { name: 'Alice', email: 'alice@example.com', message: 'Hi', countryInterest: 'Peru' };
    const res = await request(app).post('/api/contact').send(payload).expect(201);
    expect(res.body.success).toBe(true);
    expect(Contact.prototype.save).toHaveBeenCalled();
  });

  test('GET /api/contact - returns contacts', async () => {
    const docs = [{ _id: new mongoose.Types.ObjectId(), name: 'A', email: 'a@a.com', message: 'm' }];
    Contact.find.mockResolvedValue(docs);
    const res = await request(app).get('/api/contact').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(Contact.find).toHaveBeenCalled();
  });

  test('POST /api/contact - handles transporter errors gracefully', async () => {
    // Make nodemailer sendMail reject
    const nodemailer = require('nodemailer');
    nodemailer.createTransport.mockImplementation(() => {
      return { sendMail: jest.fn().mockRejectedValue(new Error('SMTP error')) };
    });

    Contact.prototype.save.mockImplementation(async function () {
      this._id = new mongoose.Types.ObjectId();
      return this;
    });

    const payload = { name: 'Bob', email: 'bob@example.com', message: 'Hello' };
    const res = await request(app).post('/api/contact').send(payload).expect(500);
    expect(res.body.error).toBeDefined();
  });
});
