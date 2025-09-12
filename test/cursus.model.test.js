const mongoose = require('mongoose');
const { expect } = require('chai');
const Cursus = require('../app/models/Cursus');

describe('📘 Modèle Cursus', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('✅ Doit créer un cursus valide', async () => {
    const cursus = new Cursus({ title: 'Cursus Test', price: 100 });
    const saved = await cursus.save();
    expect(saved.title).to.equal('Cursus Test');
    expect(saved.price).to.equal(100);
  });

  it('❌ Ne doit pas sauvegarder sans titre', async () => {
    try {
      const cursus = new Cursus({ price: 50 });
      await cursus.save();
    } catch (err) {
      expect(err.errors.title).to.exist;
    }
  });
});
