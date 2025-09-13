const User = require('../app/models/User');
const bcrypt = require('bcrypt');

describe('Authentication', () => {
  // Before each test, we clear the User collection to ensure a clean state
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('Should register a new user account', async () => {
    // Simulate sending a registration request to the API
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Camille',
        email: 'camille@example.com',
        password: '123456',
        role: 'client'
      });

    // Expect the server to respond with HTTP 200
    expect(res).to.have.status(200);
    // And the response text should indicate the account needs activation by email
    expect(res.text).to.include('activer votre compte');
  });

  it('Should log in an active user', async () => {
    // Hash the password before saving the user (same behavior as production)
    const passwordHash = await bcrypt.hash('123456', 10);

    // Create a user directly in the database with isActive=true
    await User.create({
      name: 'Camille',
      email: 'login@test.com',
      password: passwordHash,
      isActive: true
    });

    // Send login request with correct credentials
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@test.com', password: '123456' });

    // Expect successful login
    expect(res).to.have.status(200);
    // And the response should contain a welcome message
    expect(res.text).to.include('Bienvenue');
  });
});
