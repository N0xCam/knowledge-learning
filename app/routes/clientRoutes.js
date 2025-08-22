const express = require('express');
const router = express.Router();
const {
  showAllThemes,
  showAllCursus,
  showCursusDetails,
  validateLesson,
  showLesson,
  showCursusByTheme,
  showCertifications 
} = require('../controllers/clientController');



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
router.get('/certifications', showCertifications);


module.exports = router;
