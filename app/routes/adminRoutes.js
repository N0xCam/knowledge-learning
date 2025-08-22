const express = require('express');
const router = express.Router();

const {
  getAllThemes,
  getCursusByTheme,
  getLessonsByCursus
} = require('../controllers/adminController');

console.log('📦 adminRoutes.js chargé');


router.get('/themes', getAllThemes);
router.get('/themes/:themeId/cursus', getCursusByTheme);
router.get('/cursus/:cursusId/lessons', getLessonsByCursus);

module.exports = router;
