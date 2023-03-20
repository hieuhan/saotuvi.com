const router = require('express').Router();
const authController = require('../controllers/auth');
const loginValidator = require('../validators/auth/login');
const authorization = require('../middlewares/auth');

router.get('/login', authController.login).post('/login', loginValidator, authController.loginPost);
router.get('/logout', authorization, authController.logout);

module.exports = router;