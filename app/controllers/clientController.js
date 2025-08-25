const UserProgress = require('../models/UserProgress');
const UserCursus = require('../models/UserCursus');
const Theme = require('../models/Theme');
const Cursus = require('../models/Cursus');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

// 1. Tous les thèmes
exports.showAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.render('pages/client/theme-list', { themes });
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
};

// 2. Cursus par thème
exports.showCursusByTheme = async (req, res) => {
  const { themeId } = req.params;

  try {
    const cursus = await Cursus.find({ theme: themeId }).populate('theme');
    res.render('pages/client/cursus-by-theme', { cursus });
  } catch (err) {
    console.error('❌ Erreur showCursusByTheme :', err);
    res.status(500).send('Erreur serveur');
  }
};

// 3. Leçons par cursus (détails d’un cursus + achat possible)
exports.showCursusDetails = async (req, res) => {
  try {
    const cursusId = req.params.cursusId;
    const userId = req.session.user?._id;

    const cursus = await Cursus.findById(cursusId).populate('theme');
    const lessons = await Lesson.find({ cursus: cursusId });

    let hasPurchasedCursus = false;
    let purchasedLessonIds = [];

    if (userId) {
      const cursusPurchase = await Purchase.findOne({
        user: userId,
        cursus: cursusId,
        type: 'cursus'
      });

      hasPurchasedCursus = !!cursusPurchase;

      if (!hasPurchasedCursus) {
        const lessonPurchases = await Purchase.find({
          user: userId,
          lesson: { $in: lessons.map(l => l._id) },
          type: 'lesson'
        });

        purchasedLessonIds = lessonPurchases.map(p => p.lesson.toString());
      }
    }

    res.render('pages/client/cursus-details', {
      cursus,
      lessons,
      hasPurchasedCursus,
      purchasedLessonIds
    });

  } catch (err) {
    console.error('❌ Erreur showCursusDetails :', err);
    res.status(500).send('Erreur serveur');
  }
};


// 4. Afficher une leçon
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

// 5. Valider une leçon
exports.validateLesson = async (req, res) => {
  try {
    const userId = req.session.userId; // ou req.user._id
    const lessonId = req.params.lessonId;

    // Valider la leçon
    await UserProgress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { validated: true },
      { upsert: true }
    );

    // Trouver la leçon pour retrouver son cursus
    const lesson = await Lesson.findById(lessonId);
    const cursusId = lesson.cursus;

    // Récupérer toutes les leçons du cursus
    const allLessons = await Lesson.find({ cursus: cursusId });

    // Vérifier si toutes les leçons sont validées pour l'utilisateur
    const progress = await UserProgress.find({
      user: userId,
      lesson: { $in: allLessons.map(l => l._id) },
      validated: true
    });

    const allValidated = progress.length === allLessons.length;

    if (allValidated) {
      // Marquer le cursus comme validé
      await UserCursus.findOneAndUpdate(
        { user: userId, cursus: cursusId },
        { validated: true },
        { upsert: true }
      );
    }

    res.redirect('back');
  } catch (error) {
    console.error('❌ Erreur lors de la validation :', error);
    res.status(500).send('Erreur lors de la validation');
  }
};

// 6. Certifications utilisateur
exports.showCertifications = async (req, res) => {
  try {
    const userId = req.session.userId; // ou req.user._id
    const certifications = await UserCursus
      .find({ user: userId, validated: true })
      .populate('cursus');

    res.render('pages/client/certifications', { certifications });
  } catch (err) {
    console.error('❌ Erreur showCertifications :', err);
    res.status(500).send('Erreur serveur');
  }
};
