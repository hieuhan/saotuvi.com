const router = require('express').Router();
const articleController = require('../controllers/article');
const articleCreateValidator = require('../validators/article/create');
const articleEditValidator = require('../validators/article/edit');

router.get('/', articleController.index);
router.post('/binddata', articleController.binddata);
router.get('/create', articleController.create).put('/create', articleCreateValidator, articleController.createPost);
router.get('/edit/:id', articleController.edit).patch('/edit', articleEditValidator, articleController.editPost);
router.patch('/draft/:id', articleController.draft);
router.patch('/recover/:id', articleController.recover);

module.exports = router;