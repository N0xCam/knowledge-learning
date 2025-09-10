const UserProgress = require('../models/UserProgress');
const UserCursus = require('../models/UserCursus');
const Theme = require('../models/Theme');
const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

// See themes
exports.showAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.render('pages/client/theme-list', { themes });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

// See all cursus of a theme
exports.showCursusByTheme = async (req, res) => {
  try {
    const themeId = req.params.themeId;
    const theme = await Theme.findById(themeId);
    const cursusList = await Cursus.find({ theme: themeId });

    res.render('pages/client/cursus-list', { theme, cursusList });
  } catch (err) {
    console.error('❌ Erreur showCursusByTheme :', err);
    res.status(500).send('Erreur serveur');
  }
};

// Details of cursus
exports.showCursusDetails = async (req, res) => {
  try {
    const cursusId = req.params.cursusId;
    const userId = req.session.user?._id;

    const cursus = await Cursus.findById(cursusId).populate('theme');
    const lessons = await Lesson.find({ cursus: cursusId });

    let hasPurchasedCursus = false;
    let lessonAccess = {};
    let validatedLessonIds = [];

    if (userId) {
      // check the paiement of the entire cursus
      const cursusPurchase = await Purchase.findOne({
        user: userId,
        cursus: cursusId,
        type: 'cursus'
      });

      hasPurchasedCursus = !!cursusPurchase;

      // check the paiement of the entire cursus
      for (const lesson of lessons) {
        const hasLessonPurchase = await Purchase.findOne({
          user: userId,
          lesson: lesson._id,
          type: 'lesson'
        });

        lessonAccess[lesson._id] = hasPurchasedCursus || !!hasLessonPurchase;
      }

      // check the validate lessons
      const userProgress = await UserProgress.find({ user: userId });
      validatedLessonIds = userProgress
        .filter(p => p.validated)
        .map(p => p.lesson.toString());
    }

    res.render('pages/client/cursus-details', {
      cursus,
      lessons,
      hasPurchasedCursus,
      lessonAccess,
      validatedLessonIds
    });
  } catch (err) {
    console.error('❌ Erreur showCursusDetails :', err);
    res.status(500).send('Erreur serveur');
  }
};

// see a lesson
exports.showLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).send('Leçon non trouvée');
    }

    res.render('pages/client/lesson', { lesson });
  } catch (err) {
    console.error('❌ Erreur showLesson :', err);
    res.status(500).send('Erreur serveur');
  }
};

// check a lesson
exports.validateLesson = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const lessonId = req.params.lessonId;

    // check lesson by user
    await UserProgress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { validated: true },
      { upsert: true }
    );

    // see the cursus of the lesson
    const lesson = await Lesson.findById(lessonId);
    const cursusId = lesson.cursus;

    // see all lessons
    const allLessons = await Lesson.find({ cursus: cursusId });

    // check the number of validate lessons
    const validatedLessons = await UserProgress.find({
      user: userId,
      lesson: { $in: allLessons.map(l => l._id) },
      validated: true
    });

    const allValidated = validatedLessons.length === allLessons.length;

    // check if all the lessons are validate
    if (allValidated) {
      await UserCursus.findOneAndUpdate(
        { user: userId, cursus: cursusId },
        { validated: true },
        { upsert: true }
      );
    }

    // Message flash and redirect to the lesson
    req.flash('success_msg', 'Leçon validée avec succès !');
    res.redirect(`/client/lessons/${lessonId}`);

  } catch (error) {
    console.error('❌ Erreur validation leçon :', error);
    req.flash('error_msg', 'Erreur lors de la validation de la leçon.');
    res.redirect(req.get('Referrer') || '/client/themes');
  }
};


// See the certifications
exports.showCertifications = async (req, res) => {
  try {
    const userId = req.session.user?._id;
    const certifications = await UserCursus
      .find({ user: userId, validated: true })
      .populate('cursus');

    res.render('pages/client/certifications', { certifications });
  } catch (err) {
    console.error('❌ Erreur showCertifications :', err);
    res.status(500).send('Erreur serveur');
  }
};
