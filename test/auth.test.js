// test/auth.test.js
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server');            // exports the Express app (no listen in test)
const User = require('../app/models/User');

describe('Authentication', function () {
  this.timeout(10000);

  let req; // fresh agent per test (isolated cookie jar)

  beforeEach(async () => {
    req = supertest.agent(app);
    await User.deleteMany({});
  });

  it('Should register a new user account', async () => {
    const email = 'camille@example.com';

    const res = await req
      .post('/auth/register')
      .send({ name: 'Camille', email, password: '123456', role: 'client' })
      .expect(r => {
        if (![200, 201, 302].includes(r.status)) {
          throw new Error(`Unexpected status ${r.status}`);
        }
      });

    // DB effect is the source of truth
    const saved = await User.findOne({ email });
    expect(saved).to.exist;
    expect(saved.isActive).to.be.false; // still inactive until activation
  });

  it('Should log in an active user', async () => {
    // Plain password: pre-save hook will hash exactly once
    await User.create({
      name: 'Camille',
      email: 'camille@demo.com',
      password: '123456',
      isActive: true
    });

    const loginRes = await req
      .post('/auth/login')
      .send({ email: 'camille@demo.com', password: '123456' })
      .expect(r => {
        if (![200, 302].includes(r.status)) {
          throw new Error(`Unexpected status ${r.status}`);
        }
      });

    // If 200, page usually contains a welcome string
    if (loginRes.status === 200) {
      expect(loginRes.text).to.include('Bienvenue');
    }

    // If 302, make sure a session cookie was issued
    if (loginRes.status === 302) {
      const cookies = loginRes.headers['set-cookie'] || [];
      const hasSid = cookies.some(c => /^connect\.sid=/.test(c));
      expect(hasSid, 'session cookie connect.sid').to.be.true;
    }

  });
});
