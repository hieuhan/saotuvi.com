const { validationResult } = require('express-validator');

module.exports.index = async (request, response, next) => {
    try {
        response.render('admin/user', { dataInput: {}, error: {}, message: '', layout: './admin/layouts/default' });
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
        const { email, password } = request.body;

        const dataInput = { email, password };

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.render('admin/user/create', {
                error: errors.mapped(),
                message: '',
                dataInput: dataInput,
                layout: './admin/layouts/modal'
            });
        }

        response.render('admin/user/create', { dataInput: {}, error: {}, message: '', layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}