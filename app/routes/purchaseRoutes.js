const express = require('express');
const router = express.Router();
const { purchaseLesson, confirmLessonPurchase } = require('../controllers/purchaseController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/lessons/:lessonId', isAuthenticated, purchaseLesson);
router.get('/success/lesson/:lessonId', isAuthenticated, confirmLessonPurchase);

module.exports = router;
