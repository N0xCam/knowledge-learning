const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const csrf = require('csurf');
const session = require('express-session');
const flash = require('connect-flash');

dotenv.config();
const app = express();

// Session 
app.use(session({
  secret: 'knowledge-learning-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Body parsing & statics 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'app/public'))); 

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

// CSRF's protection
const csrfProtection = csrf();
app.use(csrfProtection);

// variables for views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.session = req.session;
  next();
});

// Middlewares 
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

// Home
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'Accueil' });
});

// 404
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// MongoDB + serveur
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🟢 Serveur prêt sur http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err);
  });
