const router = require('express').Router();
const errorController = require('../controllers/error');

router.get('/404', errorController.notFound);

module.exports = router;