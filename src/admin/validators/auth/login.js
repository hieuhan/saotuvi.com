const { body } = require('express-validator');

module.exports = [
    body('username')
        .not().isEmpty().withMessage('Vui lòng nhập tên truy cập'),
    // body('email')
    //     .not().isEmpty().withMessage('Vui lòng nhập email')
    //     .normalizeEmail()
    //     // .custom(async email => {
    //     //     const emailId = await User.findOne({email})
    //     //     if(!emailId) {
    //     //         return Promise.reject('No user is exists with this email')
    //     //     }
    //     //     return true
    //     // })
    //     .isEmail().withMessage('Email không hợp lệ'),
    body('password')
        .not().isEmpty().withMessage('Vui lòng nhập mật khẩu')
        //.isLength({ min: 6 }).withMessage('Vui lòng nhập mật khẩu tối thiểu 6 ký tự')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage('Mật khẩu phải bao gồm ít nhất một ký tự in hoa, một ký tự thường thường, một ký tự đặc biệt, một chữ số và độ dài tối thiểu 8 ký tự')
        // .custom(async (password, {req}) => {
        
        //     const user = await User.findOne({email: req.body.email})
        //     const result = user && await bcrypt.compare(password, user.password)

        //     if (!result) {
        //         return Promise.reject('Password is wrong')
        //     }
        //     return true
        // })
]