const router = require('express').Router();
const menuController = require('../controllers/menu');
const menuCreateValidator = require('../validators/menu/create');
const menuEditValidator = require('../validators/menu/edit');

router.get('/', menuController.index);
router.post('/binddata', menuController.binddata);
router.get('/create', menuController.create).put('/create', menuCreateValidator, menuController.createPost);

module.exports = router;