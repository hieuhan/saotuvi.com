const { body } = require('express-validator');
const { Menu } = require('../../models');

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên menu')
        .isLength({ max: 255 }).withMessage('Tên menu khuyến nghị không vượt quá 255 ký tự')
        .custom(async (name, { req }) => {
            const menuExist = await Menu.findOne({ 'position': req.body.position, 'nameLower': name.toLowerCase().trim() })
            if (menuExist) {
                return Promise.reject(`Tên menu ${name} đã tồn tại`);
            }
            return true;
        }),
    body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url menu')
        .isLength({ max: 255 }).withMessage('Url menu khuyến nghị không vượt quá 255 ký tự')
]