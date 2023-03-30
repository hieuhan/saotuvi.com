const { validationResult } = require('express-validator');
const ArticleService = require('../services/article');
const CategoryService = require('../services/category');
//const { Article } = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        //await Article.deleteMany();
        const dataInput = { keywords = '', category = '', page = 0, isDraft = 0 } = request.query;
        const data = await Promise.all([
            CategoryService.getList({
                id: ''
            }),
            ArticleService.getPage({
                keywords, category, page, isDraft
            })
        ]);

        response.render('admin/article', { categories: data[0], articles: data[1], dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords = '', category = '', page = 0, isDraft = 0 } = request.query;
        var data = { articles, pages, currentPage } = await ArticleService.getPage({
            keywords, category, page, isDraft
        })

        response.render('admin/article/binddata', { articles: data, layout: './admin/layouts/modal' });
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

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        let categories = [];

        categories.push(category);

        if (subCategory && Array.isArray(subCategory)) {
            for (var index = 0; index < subCategory.length; index++) {
                if (!categories.includes(subCategory[index]))
                    categories.push(subCategory[index]);
            }
        }

        article.subCategory = categories;

        const result = await ArticleService.insert(article);

        if (result) {
            return response.json({ success: true, message: 'Thêm mới tin bài thành công', cb: '/stv/article/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}

module.exports.edit = async (request, response, next) => {
    try {
        const { id } = request.params;
        if (!id) {
            return next(new Error('Không tìm thấy tin bài phù hợp.'));
        }

        const data = await Promise.all([
            ArticleService.getById(id),
            CategoryService.getList({
                id: ''
            })
        ]);

        response.render('admin/article/edit', { article: data[0], categories: data[1], layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.editPost = async (request, response, next) => {
    try {
        let article = {
            id, title, summary, content, slug, image, category, subCategory,
            metaTitle,
            metaDescription,
            metaKeywords,
            h1Tag,
            canonical,
            isIndex
        } = request.body;

        article.isIndex = isIndex == 1 ? true : false;

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        const articleFind = await ArticleService.getById(id);

        if (articleFind) {

            let categories = [];

            categories.push(category);
            
            if (subCategory && Array.isArray(subCategory)) {
                for (var index = 0; index < subCategory.length; index++) {
                    if (!categories.includes(subCategory[index]))
                        categories.push(subCategory[index]);
                }
            }

            article.subCategory = categories;

            await ArticleService.update(article);
            return response.json({ success: true, message: 'Cập nhật bài viết thành công', cb: '/stv/article/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}

module.exports.draft = async (request, response, next) => {
    try {
        let { id } = request.params;

        if (!id) {
            return response.json({ success: false, error: 'Vui lòng thử lại sau.' });
        }

        const articleFind = await ArticleService.getById(id);
        console.log(articleFind)
        if (articleFind) {
            await ArticleService.draft(id, request.user.username);
            return response.json({ success: true, message: 'Lưu nháp tin bài thành công', dataUrl: '/stv/article/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}

module.exports.recover = async (request, response, next) => {
    try {
        let { id } = request.params;

        if (!id) {
            return response.json({ success: false, error: 'Vui lòng thử lại sau.' });
        }

        const articleFind = await ArticleService.getById(id);

        if (articleFind) {
            await ArticleService.recover(id, request.user.username);
            return response.json({ success: true, message: 'Hủy lưu nháp tin bài thành công', dataUrl: '/stv/article/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}