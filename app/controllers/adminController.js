// ✅ adminController.js avec gestion AJAX complète (ajout, modification, suppression)
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

// 🔹 THEMES
exports.createTheme = async (req, res) => {
  try {
    const theme = await Theme.create({ title: req.body.title });
    res.status(201).json({ success: true, theme });
  } catch (err) {
    console.error('❌ Erreur createTheme :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

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

exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.themeId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteTheme :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 🔹 CURSUS
exports.createCursus = async (req, res) => {
  try {
    const { title, price, theme } = req.body;
    const cursus = await Cursus.create({ title, price, theme });
    const populated = await cursus.populate('theme');
    res.status(201).json({ success: true, cursus: populated });
  } catch (err) {
    console.error('❌ Erreur createCursus :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

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

exports.deleteCursus = async (req, res) => {
  try {
    await Cursus.findByIdAndDelete(req.params.cursusId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteCursus :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// 🔹 LEÇONS
exports.createLesson = async (req, res) => {
  try {
    const { title, price, cursus } = req.body;
    const lesson = await Lesson.create({ title, price, cursus });
    const populated = await lesson.populate('cursus');
    res.status(201).json({ success: true, lesson: populated });
  } catch (err) {
    console.error('❌ Erreur createLesson :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

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

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur deleteLesson :', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
