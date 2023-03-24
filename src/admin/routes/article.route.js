const router = require('express').Router();
const articleController = require('../controllers/article');
//const menuCreateValidator = require('../validators/menu/create');
//const menuEditValidator = require('../validators/menu/edit');

router.get('/', articleController.index);
//router.post('/binddata', menuController.binddata);
router.get('/create', articleController.create);//.put('/create', articleController.createPost);

module.exports = router;