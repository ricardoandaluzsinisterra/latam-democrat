const request = require('supertest');
const mongoose = require('mongoose');

// Mock Country model as a constructor with static methods
jest.mock('../models/Country', () => {
  const CountryMock = function (data) {
    Object.assign(this, data);
  };
  CountryMock.find = jest.fn();
  CountryMock.findById = jest.fn();
  CountryMock.findByIdAndUpdate = jest.fn();
  CountryMock.prototype.save = jest.fn();
  return CountryMock;
});

// Mock Achievement collection.find(...)
jest.mock('../models/Achievement', () => {
  return {
    collection: {
      find: jest.fn()
    }
  };
});

const Country = require('../models/Country');
const Achievement = require('../models/Achievement');

// Require app after mocks
const app = require('../server');

describe('Countries API (functional, mocked DB)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/countries - returns countries with normalized achievements', async () => {
    const countries = [
      {
        _id: new mongoose.Types.ObjectId('64b8f0f0f0f0f0f0f0f0f001'),
        name: 'Testland',
        toObject() { return { _id: this._id, name: this.name }; }
      },
      {
        _id: new mongoose.Types.ObjectId('64b8f0f0f0f0f0f0f0f0f002'),
        name: 'Otheria',
        toObject() { return { _id: this._id, name: this.name }; }
      }
    ];
    Country.find.mockResolvedValue(countries);

    // Achievements: one referencing ObjectId, one using string country name
    const rawAchievementsForTestland = [
      { _id: new mongoose.Types.ObjectId('64b8f1f1f1f1f1f1f1f1f101'), country: countries[0]._id, title: 'A1' },
      { _id: new mongoose.Types.ObjectId('64b8f1f1f1f1f1f1f1f1f102'), country: 'Testland', title: 'A2' }
    ];

    // The mocked find should react based on query; implement simple branch
    Achievement.collection.find.mockImplementation((query) => {
      const q = JSON.stringify(query);
      if (q.includes(countries[0]._id.toString())) {
        return { toArray: async () => rawAchievementsForTestland };
      }
      return { toArray: async () => [] };
    });

    const res = await request(app).get('/api/countries').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    const t = res.body.find(c => c.name === 'Testland');
    expect(t).toBeDefined();
    expect(Array.isArray(t.achievements)).toBe(true);
    expect(t.achievements.length).toBe(2);
    // All achievement.country values should be the country name
    expect(t.achievements.every(a => a.country === 'Testland')).toBe(true);
  });

  test('GET /api/countries/slug/:slug - returns single country by slug with achievements', async () => {
    const countries = [
      { _id: new mongoose.Types.ObjectId(), name: 'My Country', toObject() { return { _id: this._id, name: this.name }; } }
    ];
    Country.find.mockResolvedValue(countries);

    const rawAchievements = [
      { _id: new mongoose.Types.ObjectId(), country: 'My Country', title: 'X' }
    ];
    Achievement.collection.find.mockReturnValue({ toArray: async () => rawAchievements });

    const slug = 'my-country';
    const res = await request(app).get(`/api/countries/slug/${slug}`).expect(200);
    expect(res.body.name).toBe('My Country');
    expect(Array.isArray(res.body.achievements)).toBe(true);
    expect(res.body.achievements[0].country).toBe('My Country');
  });

  test('GET /api/countries/:id - returns 404 when not found', async () => {
    Country.findById.mockResolvedValue(null);
    const res = await request(app).get(`/api/countries/${new mongoose.Types.ObjectId()}`).expect(404);
    expect(res.body.error).toBe('Country not found');
  });

  test('POST /api/countries - creates a new country and returns 201', async () => {
    // When constructing new Country(...) the prototype.save should be used.
    const dummySaved = { _id: new mongoose.Types.ObjectId(), name: 'CreatedLand' };
    Country.prototype.save.mockImplementation(async function () {
      // simulate mongoose returning the saved doc
      Object.assign(this, dummySaved);
      return this;
    });

    const payload = { name: 'CreatedLand' };
    const res = await request(app).post('/api/countries').send(payload).expect(201);
    expect(res.body.name).toBe('CreatedLand');
    expect(Country.prototype.save).toHaveBeenCalled();
  });

  test('PUT /api/countries/:id - updates and returns updated country', async () => {
    const id = new mongoose.Types.ObjectId();
    const updated = { _id: id, name: 'UpdatedLand' };
    Country.findByIdAndUpdate.mockResolvedValue(updated);

    const res = await request(app).put(`/api/countries/${id}`).send({ name: 'UpdatedLand' }).expect(200);
    expect(res.body.name).toBe('UpdatedLand');
  });
});
