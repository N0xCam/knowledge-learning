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

router.get('/test', (req, res) => {
});

// Routes client
router.get('/themes', showAllThemes);
router.get('/themes/:themeId/cursus', showCursusByTheme); 
router.get('/cursus/:cursusId', showCursusDetails); 
router.get('/lessons/:lessonId', showLesson);
router.post('/lessons/:lessonId/validate', validateLesson); 
router.get('/certifications', isAuthenticated, showCertifications);


module.exports = router;
