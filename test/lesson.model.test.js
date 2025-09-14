const mongoose = require('mongoose');
const { expect } = require('chai');
const Lesson = require('../app/models/Lesson');
const Cursus = require('../app/models/Cursus');

describe('Lesson Model', () => {
  let cursus;

  // Connect to the test database and prepare data
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Lesson.deleteMany({});
    await Cursus.deleteMany({});
    // Create a parent cursus for the lessons
    cursus = await Cursus.create({ title: 'Parent Cursus', price: 200 });
  });

  // Disconnect after all tests are completed
  after(async () => {
    await mongoose.connection.close();
  });

  it('Should create a lesson linked to a cursus', async () => {
    // Create a lesson that references the parent cursus
    const lesson = new Lesson({ title: 'Test Lesson', price: 50, cursus: cursus._id });

    // Save it to the database
    const saved = await lesson.save();

    // Validate the saved data
    expect(saved.title).to.equal('Test Lesson');
    expect(saved.cursus.toString()).to.equal(cursus._id.toString());
  });

  it('Should not save without a title', async () => {
    try {
      // Try saving a lesson without a title
      const lesson = new Lesson({ price: 20, cursus: cursus._id });
      await lesson.save();
    } catch (err) {
      // Ensure a validation error is raised for "title"
      expect(err.errors.title).to.exist;
    }
  });
});
