const mongoose = require('mongoose');
const { expect } = require('chai');
const Cursus = require('../app/models/Cursus');

describe('Cursus Model', () => {
  // Connect to the test database before running the tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // Disconnect after all tests are completed
  after(async () => {
    await mongoose.connection.close();
  });

  it('Should create a valid Cursus', async () => {
    // Create a new cursus with valid data
    const cursus = new Cursus({ title: 'Cursus Test', price: 100 });

    // Save it to the database
    const saved = await cursus.save();

    // Check that the fields were saved correctly
    expect(saved.title).to.equal('Cursus Test');
    expect(saved.price).to.equal(100);
  });

  it('Should not save without a title', async () => {
    try {
      // Attempt to save a cursus without a title
      const cursus = new Cursus({ price: 50 });
      await cursus.save();
    } catch (err) {
      // Expect a validation error on the "title" field
      expect(err.errors.title).to.exist;
    }
  });
});
