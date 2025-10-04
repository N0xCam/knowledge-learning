const express = require('express');
const router = express.Router();

const {
  purchaseLesson,
  confirmLessonPurchase,
  purchaseCursus,
  confirmCursusPurchase
} = require('../controllers/purchaseController');

// No require('../server') here. No dotenv here. No app.listen here.
// Auth can be applied at mount level in server.js: app.use('/purchase', isAuthenticated, purchaseRoutes)

router.post('/lessons/:lessonId', purchaseLesson);
router.get('/success/lesson/:lessonId', confirmLessonPurchase);

router.post('/cursus/:cursusId', purchaseCursus);
router.get('/success/cursus/:cursusId', confirmCursusPurchase);

module.exports = router;
