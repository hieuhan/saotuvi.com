const { body } = require('express-validator');
const { Article } = require('../../models');

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Vui lòng nhập tiêu đề bài viết')
        .isLength({ max: 255 }).withMessage('Tiêu đề bài viết khuyến nghị không vượt quá 255 ký tự')
        .custom(async title => {
            const articleExist = await Article.findOne({ 'titleLower': title.toLowerCase().trim() })
            if (articleExist) {
                return Promise.reject(`Tiêu đề bài viết ${title} đã tồn tại`);
            }
            return true;
        }),
    body('category')
        .not().isEmpty().withMessage('Vui lòng chọn chuyên mục bài viết'),
    body('slug')
        .not().isEmpty().withMessage('Vui lòng nhập url bài viết')
        .isLength({ max: 255 }).withMessage('Url chuyên mục khuyến nghị không vượt quá 255 ký tự')
        .custom(async slug => {
            const articleExist = await Article.findOne({ slug })
            if (articleExist) {
                return Promise.reject(`Url bài viết ${slug} đã tồn tại`);
            }
            return true;
        }),
    body('content')
        .not().isEmpty().withMessage('Vui lòng nhập nội dung bài viết'),
]