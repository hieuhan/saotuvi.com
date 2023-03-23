const { body } = require('express-validator');
const { Category } = require('../../models');

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên chuyên mục')
        .isLength({ max: 255 }).withMessage('Tên chuyên mục khuyến nghị không vượt quá 255 ký tự')
        .custom(async name => {
            const categoryExist = await Category.findOne({'name': {'$regex': name, $options:'i'}})
            if (categoryExist) {
                return Promise.reject(`Tên chuyên mục ${name} đã tồn tại`);
            }
            return true;
        }),
    body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url chuyên mục')
        .isLength({ max: 255 }).withMessage('Url chuyên mục khuyến nghị không vượt quá 255 ký tự')
        .custom(async slug => {
            const categoryExist = await Category.findOne({ slug })
            if (categoryExist) {
                return Promise.reject(`Url chuyên mục ${slug} đã tồn tại`);
            }
            return true;
        })
]