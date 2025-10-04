// test/purchase.test.js
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server');
const User = require('../app/models/User');
const Cursus = require('../app/models/Cursus');
const Purchase = require('../app/models/Purchase'); // adapte si besoin

describe('Purchase', function () {
  this.timeout(10000);

  let req;

  beforeEach(async () => {
    req = supertest.agent(app); // garde la session pour passer l’auth middleware
    await Promise.all([
      User.deleteMany({}),
      Cursus.deleteMany({}),
      Purchase.deleteMany({})
    ]);
  });

  it('Should allow a user to purchase a cursus', async () => {
    await User.create({
      name: 'Camille',
      email: 'buy@demo.com',
      password: '123456',
      isActive: true
    });
    const cursus = await Cursus.create({ title: 'JS Avancé', price: 49 });

    // 1) Login
    await req
      .post('/auth/login')
      .send({ email: 'buy@demo.com', password: '123456' })
      .expect(r => { if (![200, 302].includes(r.status)) throw new Error(`Unexpected login ${r.status}`); });

    // 2) Achat
    const purchaseRes = await req
      .post(`/purchase/cursus/${cursus._id}`)
      .send({})
      .expect(r => { if (![200, 201, 302].includes(r.status)) throw new Error(`Unexpected purchase ${r.status}`); });

    // 3) Si redirection Stripe, on simule le retour "success"
    if (purchaseRes.status === 302) {
      const loc = purchaseRes.headers.location || '';
      const isStripe = /^https?:\/\/checkout\.stripe\.com\//i.test(loc);

      if (isStripe) {
        // on appelle directement la route de succès de ton app
        await req
          .get(`/purchase/success/cursus/${cursus._id}`)
          .expect(r => { if (![200, 302].includes(r.status)) throw new Error(`Unexpected success ${r.status}`); });
      } else {
        // si c’est une redirection interne, on la suit
        await req.get(loc).expect(r => { if (![200, 302].includes(r.status)) throw new Error(`Unexpected follow ${r.status}`); });
      }
    }

    // 4) Vérification en base
    const p = await Purchase.findOne({ cursus: cursus._id });
    expect(p, 'Purchase not found in DB').to.exist;
  });
});
