const express = require('express');
const router = express.Router();
const { registerUser, activateAccount, loginUser } = require('../controllers/authController');

console.log('📦 authRoutes.js chargé');

router.get('/test-success', (req, res) => {
  console.log('👀 Route test-success appelée');
  res.render('pages/register-success');
});

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.post('/register', registerUser);
router.get('/activate/:token', activateAccount);


// Formulaire de connexion
router.get('/login', (req, res) => {
  res.render('pages/login');
});

// Traitement de la connexion
router.post('/login', loginUser);


module.exports = router;
