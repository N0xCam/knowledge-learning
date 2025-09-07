const express = require('express');
const router = express.Router();
const {
  showAllThemes,
  showCursusByTheme,
  showCursusDetails,
  validateLesson,
  showLesson,
  showCertifications 
} = require('../controllers/clientController');
const { isAuthenticated } = require('../middlewares/authMiddleware');


console.log('📦 clientRoutes.js chargé');

router.get('/test', (req, res) => {
  res.send('✅ Route client test OK');
});

// Routes client
router.get('/themes', showAllThemes); // 🟢 Liste des thèmes
router.get('/themes/:themeId/cursus', showCursusByTheme); // 🟢 Liste des cursus d'un thème
router.get('/cursus/:cursusId', showCursusDetails); // 🟢 Détails du cursus (avec leçons)
router.get('/lessons/:lessonId', showLesson);
router.post('/lessons/:lessonId/validate', validateLesson); // 🟢 Validation d'une leçon
router.get('/certifications', isAuthenticated, showCertifications);


module.exports = router;
