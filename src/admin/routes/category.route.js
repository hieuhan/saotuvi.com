const router = require('express').Router();
const categoryController = require('../controllers/category');
const categoryCreateValidator = require('../validators/category/create');
const categoryEditValidator = require('../validators/category/edit');

router.get('/', categoryController.index);
router.post('/binddata', categoryController.binddata);
router.get('/create', categoryController.create).put('/create', categoryCreateValidator, categoryController.createPost);
router.get('/edit/:id', categoryController.edit).patch('/edit', categoryEditValidator, categoryController.editPost);
router.patch('/delete/:id', categoryController.delete);

module.exports = router;