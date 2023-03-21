const { validationResult } = require('express-validator');
const { User } = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        let { keywords, page, size } = request.query;

        if (!keywords) keywords = '';
        if (!page) page = 1;
        if (!size) size = 50;

        let searchOption = {};

        if (keywords.trim().length > 0) {
            searchOption = { $text: { $search: keywords } };
        }

        const usersList = await User.find(searchOption).skip((page - 1) * size).limit(size);

        response.render('admin/user', { usersList, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.create = async (request, response, next) => {
    try {
        response.render('admin/user/create', { dataInput: {}, error: {}, message: '', layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.createPost = async (request, response, next) => {
    try {
        const { email, password, confirmpassword } = request.body;

        const dataInput = { email, password, confirmpassword };

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        const userCreate = await User.create({
            email,
            password
        });

        //console.log(userCreate)

        return response.json({ success: true, message: 'Tạo tài khoản thành công' });
        //response.render('admin/user/create', { dataInput: {}, error: {}, message: '', layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}