const mongoose = require('mongoose');
const { expect } = require('chai');
const Lesson = require('../app/models/Lesson');
const Cursus = require('../app/models/Cursus');

describe('📖 Modèle Lesson', () => {
  let cursus;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Lesson.deleteMany({});
    await Cursus.deleteMany({});
    cursus = await Cursus.create({ title: 'Cursus Parent', price: 200 });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('✅ Doit créer une leçon liée à un cursus', async () => {
    const lesson = new Lesson({ title: 'Leçon Test', price: 50, cursus: cursus._id });
    const saved = await lesson.save();
    expect(saved.title).to.equal('Leçon Test');
    expect(saved.cursus.toString()).to.equal(cursus._id.toString());
  });

  it('❌ Ne doit pas sauvegarder sans titre', async () => {
    try {
      const lesson = new Lesson({ price: 20, cursus: cursus._id });
      await lesson.save();
    } catch (err) {
      expect(err.errors.title).to.exist;
    }
  });
});
