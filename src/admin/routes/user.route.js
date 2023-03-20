const router = require('express').Router();
const userController = require('../controllers/user');
const userCreateValidator = require('../validators/user/create');

router.get('/', userController.index);
router.get('/create', userController.create).post('/create', userCreateValidator, userController.createPost);

module.exports = router;