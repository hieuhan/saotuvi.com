const { body } = require('express-validator');
const { Menu } = require('../../models');

module.exports = [
    body('id')
        .not().isEmpty().withMessage('Vui lòng chọn menu'),
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên menu')
        .custom(async (name, { req }) => {
            const menuExist = await Menu.findOne({ '_id': { $ne: req.body.id }, 'position': req.body.position, 'nameLower': name.toLowerCase().trim() })
            if (menuExist) {
                return Promise.reject(`Tên menu ${name} đã tồn tại.`);
            }
            return true;
        }),
    body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url menu')
]