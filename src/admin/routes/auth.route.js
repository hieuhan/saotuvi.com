const router = require('express').Router();
const authController = require('../controllers/auth');
const loginValidator = require('../validators/auth/login');

router.get('/login', authController.login).post('/login', loginValidator, authController.loginPost);
router.post('/refresh-token', authController.refreshToken);
router.delete('/logout', authController.logout);

module.exports = router;