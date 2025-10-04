// test/lesson.model.test.js
const { expect } = require('chai');
const Cursus = require('../app/models/Cursus');
const Lesson = require('../app/models/Lesson');

describe('Lesson Model', function () {
  this.timeout(10000);

  let cursus;

  beforeEach(async () => {
    // No mongoose.connect() here. Just clean collections you use.
    await Promise.all([Lesson.deleteMany({}), Cursus.deleteMany({})]);
    cursus = await Cursus.create({ title: 'JS Avancé', price: 49 });
  });

  it('Should create a lesson linked to a cursus', async () => {
    const lesson = await Lesson.create({
      title: 'Introduction',
      content: 'Contenu de test',
      price: 9.99,
      cursus: cursus._id
    });

    expect(lesson._id).to.exist;
    expect(String(lesson.cursus)).to.equal(String(cursus._id));
  });

  it('Should not save without a title', async () => {
    try {
      await Lesson.create({
        content: 'Sans titre',
        price: 9.99,
        cursus: cursus._id
      });
      throw new Error('Expected validation error for missing title');
    } catch (err) {
      expect(err).to.exist;
      expect(err.name).to.equal('ValidationError');
      expect(err.errors).to.have.property('title');
    }
  });

  it('Should not save without a price', async () => {
    try {
      await Lesson.create({
        title: 'Sans prix',
        content: 'Contenu',
        cursus: cursus._id
      });
      throw new Error('Expected validation error for missing price');
    } catch (err) {
      expect(err).to.exist;
      expect(err.name).to.equal('ValidationError');
      expect(err.errors).to.have.property('price');
    }
  });
});
