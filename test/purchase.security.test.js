// test/purchase.security.test.js
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server');
const Cursus = require('../app/models/Cursus');
const Purchase = require('../app/models/Purchase');

describe('Purchase security', function () {
  this.timeout(10000);

  beforeEach(async () => {
    await Promise.all([Cursus.deleteMany({}), Purchase.deleteMany({})]);
  });

  it('should block purchase when not authenticated', async () => {
    const cursus = await Cursus.create({ title: 'JS Avancé', price: 49 });

    // pas d’agent = pas de session => devrait renvoyer 401 ou rediriger vers /auth/login
    const res = await supertest(app)
      .post(`/purchase/cursus/${cursus._id}`)
      .send({});

    expect([401, 302]).to.include(res.status);
    if (res.status === 302) {
      expect(res.headers.location || '').to.match(/\/auth\/login/i);
    }

    const p = await Purchase.findOne({ cursus: cursus._id });
    expect(p, 'No purchase should be created').to.not.exist;
  });
});
