const User = require('../app/models/User');

describe('🔐 Authentification', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('✅ Doit créer un compte utilisateur', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Camille',
        email: 'camille@example.com',
        password: '123456',
        role: 'client'
      });

    expect(res).to.have.status(200);
    expect(res.text).to.include('activer votre compte');
  });

  it('✅ Doit connecter un utilisateur actif', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);
    await User.create({
      name: 'Camille',
      email: 'login@test.com',
      password: passwordHash,
      isActive: true
    });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@test.com', password: '123456' });

    expect(res).to.have.status(200);
    expect(res.text).to.include('Bienvenue');
  });
});
