const router = require('express').Router();
const mediaController = require('../controllers/media');
const { uploadImages, resizeImages } = require('../middlewares/upload');

router.get('/', mediaController.index);
router.post('/binddata', mediaController.binddata);
router.post('/upload', uploadImages, resizeImages, mediaController.upload);

module.exports = router;