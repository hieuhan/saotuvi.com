const { body } = require('express-validator');
const { Category } = require('../../models');

module.exports = [
    body('id')
        .not().isEmpty().withMessage('Vui lòng chọn chuyên mục'),
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên chuyên mục')
        .custom(async (name, { req }) => {
            const categoryExist = await Category.findOne({'_id': { $ne : req.body.id }, 'nameLower': name.toLowerCase().trim() })
            if (categoryExist) {
                return Promise.reject(`Tên chuyên mục ${ name } đã tồn tại.`);
            }
            return true;
        }),
        body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url chuyên mục')
        .custom(async (slug, { req }) => {
            const categoryExist = await Category.findOne({'_id': { $ne : req.body.id }, 'slug': slug })
            if (categoryExist) {
                return Promise.reject(`Url chuyên mục ${ slug } đã tồn tại.`);
            }
            return true;
        })
]