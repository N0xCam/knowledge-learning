const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Initialisation
dotenv.config();
const app = express();
console.log('🚀 Lancement du serveur...');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// Routes
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const clientRoutes = require('./app/routes/clientRoutes');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes); 

// Page d’accueil
app.get('/', (req, res) => {
  console.log('🌍 Route / appelée');
  res.send('Bienvenue sur Knowledge Learning');
});

// 404
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Connexion DB + Lancement serveur
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🟢 Serveur prêt sur http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err);
  });
