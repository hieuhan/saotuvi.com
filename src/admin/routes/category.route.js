const router = require('express').Router();
const categoryController = require('../controllers/category');
const categoryCreateValidator = require('../validators/category/create');

router.get('/', categoryController.index);
router.post('/binddata', categoryController.binddata);
router.get('/create', categoryController.create).put('/create', categoryCreateValidator, categoryController.createPost);
router.get('/edit/:id', categoryController.edit).patch('/edit', categoryController.editPost);

module.exports = router;