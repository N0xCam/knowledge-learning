
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const { isAdmin } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');

router.use(csrfProtection);
router.use(isAdmin);

router.get('/dashboard', adminController.adminDashboard);
router.get('/users', adminController.getAllUsers);
router.post('/users/create', adminController.createUser);
router.post('/users/:userId/update', adminController.updateUser);
router.post('/users/:userId/delete', adminController.deleteUser);
router.post('/themes/create', adminController.createTheme);
router.post('/themes/:themeId/update', adminController.updateTheme);
router.post('/themes/:themeId/delete', adminController.deleteTheme);
router.post('/cursus/create', adminController.createCursus);
router.post('/cursus/:cursusId/update', adminController.updateCursus);
router.post('/cursus/:cursusId/delete', adminController.deleteCursus);
router.post('/lessons/create', adminController.createLesson);
router.post('/lessons/:lessonId/update', adminController.updateLesson);
router.post('/lessons/:lessonId/delete', adminController.deleteLesson);

module.exports = router;
