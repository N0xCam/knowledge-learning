const { expect } = require('chai');
const Cursus = require('../app/models/Cursus');

describe('Cursus Model', function () {
  this.timeout(10000);

  // PAS de mongoose.connect ici – la connexion est déjà faite en setup

  it('Should create a valid Cursus', async () => {
    const c = await Cursus.create({ title: 'JS Avancé', price: 49 });
    expect(c._id).to.exist;
  });

  it('Should not save without a title', async () => {
    let err;
    try {
      await Cursus.create({ price: 49 });
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
  });
});
