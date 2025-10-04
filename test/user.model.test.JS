const { expect } = require('chai');
const User = require('../app/models/User');

describe('User Model', function () {
  this.timeout(10000);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with a hashed password', async () => {
    const u = await User.create({
      name: 'Camille',
      email: 'hash@test.com',
      password: 'secret' // sera hashé par le hook
    });

    expect(u._id).to.exist;
    expect(u.password).to.be.a('string');
    expect(u.password).to.not.equal('secret');
  });

  it('should not save a user without an email', async () => {
    let err;
    try {
      await User.create({ name: 'NoMail', password: 'x' });
    } catch (e) { err = e; }

    expect(err).to.exist;
    expect(err.name).to.equal('ValidationError');
    expect(err.errors).to.have.property('email');
  });
});
