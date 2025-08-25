const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const csrf = require('csurf');
const session = require('express-session');

dotenv.config();
const app = express();
console.log('🚀 Lancement du serveur...');

// Session (⚠️ Obligatoire AVANT le CSRF)
app.use(session({
  secret: 'knowledge-learning-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// CSRF
const csrfProtection = csrf();
app.use(csrfProtection);

// Passer le token aux vues
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user || null; // utile dans les vues
  next();
});

// 🔐 Middlewares d'auth
const { isAuthenticated, isAdmin } = require('./app/middlewares/authMiddleware');

// Routes
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const clientRoutes = require('./app/routes/clientRoutes');
const purchaseRoutes = require('./app/routes/purchaseRoutes');

app.use('/auth', authRoutes);
app.use('/admin', isAuthenticated, isAdmin, adminRoutes);
app.use('/client', isAuthenticated, clientRoutes);
app.use('/purchase', isAuthenticated, purchaseRoutes);

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
