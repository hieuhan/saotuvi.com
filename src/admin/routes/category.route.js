const router = require('express').Router();
const categoryController = require('../controllers/category');
const categoryCreateValidator = require('../validators/category/create');

router.get('/', categoryController.index);
router.get('/create', categoryController.create).put('/create', categoryCreateValidator, categoryController.createPost);
router.patch('/edit/:id', categoryController.edit).put('/edit/:id', categoryController.editPost);

module.exports = router;