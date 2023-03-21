const { body } = require('express-validator');
const { Category } = require('../../models');

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Vui lòng nhập tên chuyên mục')
        .normalizeEmail()
        .custom(async name => {
            const categoryExist = await Category.findOne({ name })
            if (categoryExist) {
                return Promise.reject(`Tên chuyên mục ${name} đã tồn tại.`);
            }
            return true;
        })
]