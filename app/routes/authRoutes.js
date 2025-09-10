const express = require('express');
const router = express.Router();
const { registerUser, activateAccount, loginUser, afficherCatalogue } = require('../controllers/authController');

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.post('/register', registerUser);
router.get('/activate/:token', activateAccount);



router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/login', loginUser);

router.get('/catalogue', (req, res) => {
  afficherCatalogue();
  res.send('Catalogue affiché dans la console.');
});

module.exports = router;
