const mongoose = require('mongoose');
const User = require('../app/models/User');
const Cursus = require('../app/models/Cursus');
const Purchase = require('../app/models/Purchase');
const bcrypt = require('bcrypt');

describe('Purchase', () => {
  let user, cursus;

  // Connect to the test database
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // Disconnect after all tests
  after(async () => {
    await mongoose.connection.close();
  });

  // Reset collections and prepare test data before each test
  beforeEach(async () => {
    await User.deleteMany({});
    await Cursus.deleteMany({});
    await Purchase.deleteMany({});

    // Create a test user with a hashed password
    const passwordHash = await bcrypt.hash('123456', 10);
    user = await User.create({
      name: 'Test Client',
      email: 'client@test.com',
      password: passwordHash,
      isActive: true
    });

    // Create a test cursus
    cursus = await Cursus.create({
      title: 'Test Cursus',
      price: 100
    });
  });

  it('Should allow a user to purchase a cursus', async () => {
    // Send a purchase request
    const res = await request(app)
      .post(`/purchase/cursus/${cursus._id}`)
      .send({ userId: user._id });

    // Check the HTTP response
    expect(res).to.have.status(200);
    expect(res.text).to.include('Achat réussi');

    // Ensure the purchase is stored in the database
    const purchase = await Purchase.findOne({ user: user._id, cursus: cursus._id });
    expect(purchase).to.not.be.null;
  });
});
