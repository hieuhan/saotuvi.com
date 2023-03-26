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
        //console.log(data[1]);
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
        response.render('admin/article/create', { data: categories, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.createPost = async (request, response, next) => {
    try {
        const article = {
            title, summary, content, slug, image, category, subCategory,
            metaTitle,
            metaDescription,
            metaKeywords,
            h1Tag,
            canonical,
            isIndex
        } = request.body;
        
        let categories = [];

        categories.push(category);

        if(subCategory){
            for(var index = 0; index < subCategory.length; index ++){
                categories.push(subCategory[index]);
            }
        }

        article.subCategory = categories;

        const result = await ArticleService.insert(article);

        console.log(result);

        return response.json({ success: true, message: 'Tạo tin bài thành công', cb: '/stv/article/binddata' });
    } catch (error) {
        next(error);
    }
}