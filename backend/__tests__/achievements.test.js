const request = require('supertest');
const mongoose = require('mongoose');

jest.mock('../models/Achievement', () => {
  const AchievementMock = function (data) {
    Object.assign(this, data);
  };
  AchievementMock.find = jest.fn();
  AchievementMock.prototype.save = jest.fn();
  return AchievementMock;
});

const Achievement = require('../models/Achievement');
const app = require('../server');

describe('Achievements API (functional, mocked DB)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/achievements - returns achievements with optional filters', async () => {
    const docs = [
      { _id: new mongoose.Types.ObjectId(), title: 'Invention', country: 'X', category: 'Technology' },
      { _id: new mongoose.Types.ObjectId(), title: 'Treaty', country: 'Y', category: 'Governance' },
    ];
    Achievement.find.mockResolvedValue(docs);

    const res = await request(app).get('/api/achievements').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(Achievement.find).toHaveBeenCalledWith({});
  });

  test('GET /api/achievements?country=X - applies filter', async () => {
    const docs = [{ _id: new mongoose.Types.ObjectId(), title: 'Invention', country: 'X', category: 'Technology' }];
    Achievement.find.mockResolvedValue(docs);

    const res = await request(app).get('/api/achievements').query({ country: 'X' }).expect(200);
    expect(res.body[0].country).toBe('X');
    expect(Achievement.find).toHaveBeenCalledWith({ country: 'X' });
  });

  test('POST /api/achievements - creates achievement and returns 201', async () => {
    const payload = { title: 'New', country: new mongoose.Types.ObjectId(), category: 'Science' };
    const saved = { _id: new mongoose.Types.ObjectId(), ...payload };
    Achievement.prototype.save.mockImplementation(async function () {
      Object.assign(this, saved);
      return this;
    });

    const res = await request(app).post('/api/achievements').send(payload).expect(201);
    expect(res.body.title).toBe('New');
    expect(Achievement.prototype.save).toHaveBeenCalled();
  });

  test('POST /api/achievements - returns 400 on validation error', async () => {
    // Missing required fields, simulate Mongoose throwing an error
    Achievement.prototype.save.mockImplementation(async function () {
      const err = new Error('Validation failed');
      throw err;
    });

    const res = await request(app).post('/api/achievements').send({}).expect(400);
    expect(res.body.error).toBeDefined();
  });
});
