const { body } = require('express-validator');
const { Menu } = require('../../models');

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên menu')
        .isLength({ max: 255 }).withMessage('Tên menu khuyến nghị không vượt quá 255 ký tự')
        .custom(async name => {
            const menuExist = await Menu.findOne({'name': {'$regex': name, $options:'i'}})
            if (menuExist) {
                return Promise.reject(`Tên menu ${name} đã tồn tại`);
            }
            return true;
        }),
    body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url menu')
        .isLength({ max: 255 }).withMessage('Url cmenu khuyến nghị không vượt quá 255 ký tự')
        .custom(async slug => {
            const menuExist = await Menu.findOne({ slug })
            if (menuExist) {
                return Promise.reject(`Url menu ${slug} đã tồn tại`);
            }
            return true;
        })
]