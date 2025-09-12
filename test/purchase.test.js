const mongoose = require('mongoose');
const User = require('../app/models/User');
const Cursus = require('../app/models/Cursus');
const Purchase = require('../app/models/Purchase');
const bcrypt = require('bcrypt');

describe('💳 Achats', () => {
  let user, cursus;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Cursus.deleteMany({});
    await Purchase.deleteMany({});

    const passwordHash = await bcrypt.hash('123456', 10);
    user = await User.create({
      name: 'Client Test',
      email: 'client@test.com',
      password: passwordHash,
      isActive: true
    });

    cursus = await Cursus.create({
      title: 'Cursus Test',
      price: 100
    });
  });

it('✅ Doit acheter un cursus', async () => {
  const res = await request(app)   // <= request(app), pas juste request
    .post(`/purchase/cursus/${cursus._id}`)
    .send({ userId: user._id });

  expect(res).to.have.status(200);
  expect(res.text).to.include('Achat réussi');

  const purchase = await Purchase.findOne({ user: user._id, cursus: cursus._id });
  expect(purchase).to.not.be.null;
});


});
