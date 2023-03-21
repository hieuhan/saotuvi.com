const router = require('express').Router();
const mediaController = require('../controllers/media');
//const { upload, uploadImages, resizeImages, getResult} = require('../middlewares/upload');
const upload = require('../utils/multer');
router.get('/', mediaController.index);
router.post('/upload', upload.any(), mediaController.upload);

module.exports = router;