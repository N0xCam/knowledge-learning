const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../config/mailer');

// ✅ Fonction d'inscription
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email déjà utilisé.');

    const newUser = new User({ name, email, password, role });

    const token = crypto.randomBytes(32).toString('hex');
    newUser.activationToken = token;
    await newUser.save();

    const activationLink = `http://localhost:3000/auth/activate/${token}`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: newUser.email,
      subject: 'Active ton compte Knowledge Learning ✨',
      html: `
        <h2>Bienvenue ${newUser.name} !</h2>
        <p>Clique ici pour activer ton compte :</p>
        <a href="${activationLink}">${activationLink}</a>
      `
    });

    res.status(201).render('pages/register-success');
  } catch (err) {
    console.error('💥 ERREUR DANS registerUser :', err);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ Fonction d’activation
const activateAccount = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({ activationToken: token });
    if (!user) return res.status(400).send('Lien invalide ou expiré.');

    user.isActive = true;
    user.activationToken = null;
    await user.save();

    res.send('✅ Ton compte est maintenant activé ! Tu peux te connecter.');
  } catch (err) {
    console.error('💥 ERREUR DANS activateAccount :', err);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ Fonction de connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Utilisateur non trouvé.');
    if (!user.isActive) return res.status(403).send('Compte non activé.');
    if (user.password !== password) return res.status(401).send('Mot de passe incorrect.');

    res.send(`Bienvenue ${user.name} ! 🎉`);
  } catch (err) {
    console.error('💥 ERREUR DANS loginUser :', err);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ Export des fonctions
module.exports = { registerUser, activateAccount, loginUser };
