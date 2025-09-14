const mongoose = require('mongoose');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const User = require('../app/models/User');

describe('User Model', () => {
  // Connect to the test database before running tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  // Disconnect after tests
  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a user with a hashed password', async () => {
    const user = new User({
      name: 'Camille',
      email: 'camille@test.com',
      password: '123456',
      role: 'client'
    });

    const saved = await user.save();

    expect(saved.name).to.equal('Camille');
    expect(saved.email).to.equal('camille@test.com');

    // Verify that the stored password is hashed
    const isMatch = await bcrypt.compare('123456', saved.password);
    expect(isMatch).to.be.true;
  });

  it('should not save a user without an email', async () => {
    try {
      const user = new User({ name: 'No Email', password: '123456' });
      await user.save();
      throw new Error('User was saved without an email');
    } catch (err) {
      expect(err.errors.email).to.exist;
    }
  });
});
