const mongoose = require('mongoose');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const User = require('../app/models/User');

describe('👤 Modèle User', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('✅ Doit créer un utilisateur avec mot de passe hashé', async () => {
    const user = new User({
      name: 'Camille',
      email: 'camille@test.com',
      password: '123456',
      role: 'client'
    });
    const saved = await user.save();

    expect(saved.name).to.equal('Camille');
    expect(saved.email).to.equal('camille@test.com');
    const isMatch = await bcrypt.compare('123456', saved.password);
    expect(isMatch).to.be.true;
  });

  it('❌ Ne doit pas sauvegarder sans email', async () => {
    try {
      const user = new User({ name: 'Sans Email', password: '123456' });
      await user.save();
      throw new Error('Utilisateur sauvegardé sans email ❌');
    } catch (err) {
      expect(err.errors.email).to.exist;
    }
  });
});
