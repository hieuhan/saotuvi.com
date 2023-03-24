const { validationResult } = require('express-validator');
const ArticleService = require('../services/article');
const CategoryService = require('../services/category');

module.exports.index = async (request, response, next) => {
    try {
        const { keywords = '', category = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        const data = await Promise.all([
            CategoryService.getList({
                id: ''
            }),
            ArticleService.getPage({
                keywords, page, limit, isDeleted
            })
        ]);

        const dataInput = { keywords, category, page, limit, isDeleted };

        response.render('admin/article', { data: { categories: data[0], articles: data[1] }, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.create = async (request, response, next) => {
    try {
        const categories = await CategoryService.getList({
            id: ''
        });
        response.render('admin/article/create', { data: categories, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}