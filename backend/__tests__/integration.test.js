const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let app;
let Country;
let Achievement;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  // Ensure mongoose connects before requiring app so models use same connection
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // require models after connection
  Country = require('../models/Country');
  Achievement = require('../models/Achievement');

  // require app (server) after env and mongoose connect
  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  // Clear DB between tests
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

describe('Integration tests (mongodb-memory-server)', () => {
  test('POST /api/countries and GET /api/countries returns country with achievements attached', async () => {
    // Create country via API
    const countryPayload = { name: 'IntegrationLand', region: 'Test', description: 'desc' };
    const postRes = await request(app).post('/api/countries').send(countryPayload).expect(201);
    const countryId = postRes.body._id;

    // Create achievements that reference the country by ObjectId and by string name
    await Achievement.create({ title: 'ObjRef', country: countryId, category: 'Art' });
    await Achievement.create({ title: 'NameRef', country: 'IntegrationLand', category: 'Science' });

    const res = await request(app).get('/api/countries').expect(200);
    const found = res.body.find(c => c.name === 'IntegrationLand');
    expect(found).toBeDefined();
    expect(Array.isArray(found.achievements)).toBe(true);
    expect(found.achievements.length).toBe(2);
    // achievements should have country normalized to name
    expect(found.achievements.every(a => a.country === 'IntegrationLand')).toBe(true);
  });

  test('GET /api/countries/slug/:slug returns single country by slug', async () => {
    const c = await Country.create({ name: 'My Slug Country' });
    await Achievement.create({ title: 'SlugA', country: c.name, category: 'Culture' });

    const slug = 'my-slug-country';
    const res = await request(app).get(`/api/countries/slug/${slug}`).expect(200);
    expect(res.body.name).toBe('My Slug Country');
    expect(Array.isArray(res.body.achievements)).toBe(true);
    expect(res.body.achievements.length).toBe(1);
  });

  test('GET /api/countries/:id returns 404 when not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await request(app).get(`/api/countries/${fakeId}`).expect(404);
  });

  test('Achievements endpoint supports filters', async () => {
    const c1 = await Country.create({ name: 'F1' });
    const c2 = await Country.create({ name: 'F2' });
    await Achievement.create({ title: 'A1', country: c1._id, category: 'Technology' });
    await Achievement.create({ title: 'A2', country: c2._id, category: 'Art' });

    const resAll = await request(app).get('/api/achievements').expect(200);
    expect(resAll.body.length).toBe(2);

    const resFiltered = await request(app).get('/api/achievements').query({ country: c1._id.toString() }).expect(200);
    expect(resFiltered.body.length).toBe(1);
    expect(resFiltered.body[0].title).toBe('A1');
  });

  test('Contact endpoint: submit and retrieve', async () => {
    // Mock nodemailer transporter to avoid real emails
    jest.resetModules();
    const nodemailer = require('nodemailer');
    nodemailer.createTransport = jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue(true) }));

    const payload = { name: 'Int User', email: 'int@example.com', message: 'Hello' };
    const post = await request(app).post('/api/contact').send(payload).expect(201);
    expect(post.body.success).toBe(true);

    const get = await request(app).get('/api/contact').expect(200);
    expect(Array.isArray(get.body)).toBe(true);
    expect(get.body.length).toBe(1);
    expect(get.body[0].email).toBe('int@example.com');
  });
});
