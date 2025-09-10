const User = require('../models/User');
const Theme = require('../models/Theme');
const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

exports.adminDashboard = async (req, res) => {
  try {
    const users = await User.find();
    const themes = await Theme.find();
    const cursus = await Cursus.find().populate('theme');
    const lessons = await Lesson.find().populate('cursus');
    const purchases = await Purchase.find().populate('user cursus lesson');

    res.render('pages/admin/admin-dashboard', {
      users,
      themes,
      cursus,
      lessons,
      purchases,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.error('❌ Erreur adminDashboard :', err);
    res.status(500).send('Erreur serveur');
  }
};

// See users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('❌ Erreur getAllUsers :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('❌ Erreur createUser :', err);
    req.flash('error_msg', 'Erreur lors de la création de l’utilisateur.');
    res.redirect('/admin/dashboard');
  }
};


// update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, role, isActive },
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('❌ Erreur updateUser :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteUser :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// see theme
exports.createTheme = async (req, res) => {
  try {
    await Theme.create({ title: req.body.title });
    res.redirect('/admin/dashboard'); 
  } catch (err) {
    console.error('❌ Erreur createTheme :', err);
    res.status(500).send('Erreur serveur');
  }
};

// update theme
exports.updateTheme = async (req, res) => {
  try {
    const updatedTheme = await Theme.findByIdAndUpdate(
      req.params.themeId,
      { title: req.body.title },
      { new: true }
    );
    res.status(200).json({ success: true, theme: updatedTheme });
  } catch (err) {
    console.error('❌ Erreur updateTheme :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// delete theme
exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.themeId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteTheme :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Create cursus
exports.createCursus = async (req, res) => {
  try {
    const { title, price, theme } = req.body;

    await Cursus.create({ title, price, theme });

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('❌ Erreur createCursus :', err);
    res.status(500).send('Erreur serveur');
  }
};

// Update cursus
exports.updateCursus = async (req, res) => {
  try {
    const { title, price } = req.body;
    const updated = await Cursus.findByIdAndUpdate(
      req.params.cursusId,
      { title, price },
      { new: true }
    ).populate('theme');
    res.status(200).json({ success: true, cursus: updated });
  } catch (err) {
    console.error('❌ Erreur updateCursus :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Delete cursus
exports.deleteCursus = async (req, res) => {
  try {
    await Cursus.findByIdAndDelete(req.params.cursusId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteCursus :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


// Create Lesson
exports.createLesson = async (req, res) => {
  try {
    const { title, price, cursus } = req.body;

    await Lesson.create({ title, price, cursus });

    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('❌ Erreur createLesson :', err);
    res.status(500).send('Erreur serveur');
  }
};

// Update Lesson
exports.updateLesson = async (req, res) => {
  try {
    const { title, price } = req.body;
    const updated = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      { title, price },
      { new: true }
    ).populate('cursus');
    res.status(200).json({ success: true, lesson: updated });
  } catch (err) {
    console.error('❌ Erreur updateLesson :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Delete Lesson
exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteLesson :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

