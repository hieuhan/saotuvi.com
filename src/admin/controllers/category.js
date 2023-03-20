const { Category } = require("../models");

module.exports.index = async (request, response, next) => {
    try {
        response.render('admin/category', { categoriesList: [], layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.create = async (request, response, next) => {
    try {
        response.render('admin/category/create', { layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.createPost = async (request, response, next) => {
    try {
        response.render('admin/category/create', { layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.edit = async (request, response, next) => {
    try {
        const { id } = request.params;

        if(id)
        {
            const categoryById = await Category.findOne({ id });

            console.log(categoryById)
        }

        response.render('admin/category/edit', { layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.editPost = async (request, response, next) => {
    try {
        response.render('admin/category/edit', { layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}