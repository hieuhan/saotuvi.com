const { body } = require('express-validator');
const { User } = require('../../models');

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Vui lòng nhập email')
        .normalizeEmail()
        .isEmail().withMessage('Email không hợp lệ')
        .custom(async email => {
            const userExist = await User.findOne({ email })
            if (userExist) {
                return Promise.reject(`Email ${ email } đã được sử dụng.`);
            }
            return true;
        }),
    body('password')
        .not().isEmpty().withMessage('Vui lòng nhập mật khẩu')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage('Mật khẩu phải bao gồm ít nhất một ký tự in hoa, một ký tự thường thường, một ký tự đặc biệt, một chữ số và độ dài tối thiểu 8 ký tự'),
    body('confirmpassword')
        .not().isEmpty().withMessage('Vui lòng nhập mật khẩu xác nhận')
        .custom((confirmpassword, { req }) => {
            if (confirmpassword !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không chính xác');
            }
            return true;
        })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage('Mật khẩu phải bao gồm ít nhất một ký tự in hoa, một ký tự thường thường, một ký tự đặc biệt, một chữ số và độ dài tối thiểu 8 ký tự')
]