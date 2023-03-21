const { body } = require('express-validator');
const { Category } = require('../../models');

module.exports = [
    body('categoryName')
        .not().isEmpty().withMessage('Vui lòng nhập tên chuyên mục')
        .normalizeEmail()
        .custom(async (name, { req }) => {
            const categoryExist = await Category.findOne({ _id: { $ne: req.body.id, name } })
            if (categoryExist) {
                return Promise.reject(`Tên chuyên mục ${name} đã tồn tại.`);
            }
            return true;
        })
]