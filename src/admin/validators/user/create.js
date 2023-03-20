const { body } = require('express-validator');

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Vui lòng nhập email')
        .normalizeEmail()
        .isEmail().withMessage('Email không hợp lệ'),
    body('password')
        .not().isEmpty().withMessage('Vui lòng nhập mật khẩu')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage('Mật khẩu phải bao gồm ít nhất một ký tự in hoa, một ký tự thường thường, một ký tự đặc biệt, một chữ số và độ dài tối thiểu 8 ký tự')
]