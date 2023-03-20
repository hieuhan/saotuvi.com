const router = require('express').Router();
const dashboardController = require('../controllers/dashboard');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, dashboardController.index);

module.exports = router;