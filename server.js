const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration des vues EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

console.log('🚀 Lancement du serveur...');

// Import des routes
const authRoutes = require('./app/routes/authRoutes');
app.use('/auth', authRoutes);

// Route de test directe
app.get('/', (req, res) => {
  console.log('🌍 Route / appelée');
  res.send('Accueil OK');
});

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');
    app.listen(process.env.PORT || 3000, () => {
      console.log('🟢 Serveur prêt sur http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB :', err);
  });
