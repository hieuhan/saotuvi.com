const router = require('express').Router();
const errorController = require('../controllers/error');

router.get('/404.html', errorController.notFound);
router.get('/500.html', errorController.internalServerError);

module.exports = router;