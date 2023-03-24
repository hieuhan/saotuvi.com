const { body } = require('express-validator');
const { Category } = require('../../models');

module.exports = [
    body('id')
        .not().isEmpty().withMessage('Vui lòng chọn menu'),
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên menu')
        .custom(async (name, { req }) => {
            const categoryExist = await Category.findOne({'_id': { $ne : req.body.id }, 'name': {'$regex': name, $options: 'i'}})
            if (categoryExist) {
                return Promise.reject(`Tên menu ${name} đã tồn tại.`);
            }
            return true;
        }),
        body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url menu')
        .custom(async (slug, { req }) => {
            const categoryExist = await Category.findOne({'_id': { $ne : req.body.id }, 'slug': {'$regex': slug, $options: 'i'}})
            if (categoryExist) {
                return Promise.reject(`Url menu ${slug} đã tồn tại.`);
            }
            return true;
        })
]