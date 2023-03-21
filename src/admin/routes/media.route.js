const router = require('express').Router();
const mediaController = require('../controllers/media');

router.get('/', mediaController.index);

module.exports = router;