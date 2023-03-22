const router = require('express').Router();
const mediaController = require('../controllers/media');
const { uploadImages, resizeImages, getResult} = require('../middlewares/upload');
//const upload = require('../utils/multer');
router.get('/', mediaController.index);
router.post('/upload', uploadImages, resizeImages, getResult, mediaController.upload);

module.exports = router;