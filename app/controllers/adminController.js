const Theme = require('../models/Theme');
const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');

// GET /admin/themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.render('pages/admin/themes', { themes });
  } catch (err) {
    console.error('❌ Erreur getAllThemes :', err);
    res.status(500).send('Erreur serveur');
  }
};

// GET /admin/themes/:themeId/cursus
exports.getCursusByTheme = async (req, res) => {
  try {
    const { themeId } = req.params;
    const cursus = await Cursus.find({ theme: themeId });
    res.json(cursus);
  } catch (err) {
    console.error('❌ Erreur getCursusByTheme :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /admin/cursus/:cursusId/lessons
exports.getLessonsByCursus = async (req, res) => {
  try {
    const { cursusId } = req.params;
    const lessons = await Lesson.find({ cursus: cursusId });
    res.json(lessons);
  } catch (err) {
    console.error('❌ Erreur getLessonsByCursus :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
