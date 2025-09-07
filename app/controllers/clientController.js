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

// 2. Tous les cursus d’un thème
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

// 3. Détails d’un cursus (avec gestion achat + accès leçons)
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
      // Vérifie si le cursus complet a été acheté
      const cursusPurchase = await Purchase.findOne({
        user: userId,
        cursus: cursusId,
        type: 'cursus'
      });

      hasPurchasedCursus = !!cursusPurchase;

      // Vérifie les achats individuels pour chaque leçon
      for (const lesson of lessons) {
        const hasLessonPurchase = await Purchase.findOne({
          user: userId,
          lesson: lesson._id,
          type: 'lesson'
        });

        lessonAccess[lesson._id] = hasPurchasedCursus || !!hasLessonPurchase;
      }

      // Vérifie les leçons validées
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

// 4. Affichage d’une leçon
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
    const userId = req.session.user?._id;
    const lessonId = req.params.lessonId;

    // Marquer la leçon comme validée pour l'utilisateur
    await UserProgress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { validated: true },
      { upsert: true }
    );

    // Récupérer le cursus de la leçon
    const lesson = await Lesson.findById(lessonId);
    const cursusId = lesson.cursus;

    // Récupérer toutes les leçons du cursus
    const allLessons = await Lesson.find({ cursus: cursusId });

    // Vérifier combien sont validées
    const validatedLessons = await UserProgress.find({
      user: userId,
      lesson: { $in: allLessons.map(l => l._id) },
      validated: true
    });

    const allValidated = validatedLessons.length === allLessons.length;

    // Si toutes les leçons sont validées, on valide le cursus
    if (allValidated) {
      await UserCursus.findOneAndUpdate(
        { user: userId, cursus: cursusId },
        { validated: true },
        { upsert: true }
      );
    }

    // Message flash et redirection vers la leçon
    req.flash('success_msg', 'Leçon validée avec succès !');
    res.redirect(`/client/lessons/${lessonId}`);

  } catch (error) {
    console.error('❌ Erreur validation leçon :', error);
    req.flash('error_msg', 'Erreur lors de la validation de la leçon.');
    res.redirect(req.get('Referrer') || '/client/themes');
  }
};


// 6. Voir les certifications
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
