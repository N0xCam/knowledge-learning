const express = require('express');
const router = express.Router();
const {
  purchaseLesson,
  confirmLessonPurchase,
  purchaseCursus,
  confirmCursusPurchase
} = require('../controllers/purchaseController');

const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/lessons/:lessonId', isAuthenticated, purchaseLesson);
router.get('/success/lesson/:lessonId', isAuthenticated, confirmLessonPurchase);

router.post('/cursus/:cursusId', isAuthenticated, purchaseCursus);
router.get('/success/cursus/:cursusId', isAuthenticated, confirmCursusPurchase);

module.exports = router;
