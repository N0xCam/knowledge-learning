// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf');

// Load env once (use .env.test when NODE_ENV=test)
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: envPath, override: false });

const app = express();

// Sessions and flash messages (required before routes using req.session / flash)
app.use(session({
  secret: process.env.SESSION_SECRET || 'knowledge-learning-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Body parsers and static assets
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app/public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// CSRF protection (disabled in test or if CSRF_ENABLED=false)
const csrfEnabled = (process.env.CSRF_ENABLED ?? 'true') !== 'false' && process.env.NODE_ENV !== 'test';
if (csrfEnabled) {
  const csrfProtection = csrf();
  app.use(csrfProtection);
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  });
} else {
  // Provide a stub so templates calling csrfToken() won't crash
  app.use((req, res, next) => {
    req.csrfToken = () => '';
    res.locals.csrfToken = '';
    next();
  });
}

// Make session available in all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes (protect admin/client/purchase with auth middleware)
const { isAuthenticated, isAdmin } = require('./app/middlewares/authMiddleware');
const authRoutes = require('./app/routes/authRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const clientRoutes = require('./app/routes/clientRoutes');
const purchaseRoutes = require('./app/routes/purchaseRoutes');

app.use('/auth', authRoutes);
app.use('/admin', isAuthenticated, isAdmin, adminRoutes);
app.use('/client', isAuthenticated, clientRoutes);
app.use('/purchase', isAuthenticated, purchaseRoutes);

// Home
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Accueil' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Connect to MongoDB and start server (do NOT listen during tests)
const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? (process.env.MONGODB_URI || process.env.MONGO_URI)
    : (process.env.MONGO_URI || process.env.MONGODB_URI);


mongoose.connect(MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🟢 Serveur prêt sur http://localhost:${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err);
  });

module.exports = app;
