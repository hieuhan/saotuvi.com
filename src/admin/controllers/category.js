const { validationResult } = require('express-validator');
const CategoryService = require('../services/category');
//const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        let { keywords, page, limit } = request.query;

        page = page || 0; limit = limit || 50;

        var data = await CategoryService.getList({
            keywords, page, limit
        });

        const dataInput = { keywords, page, limit };

        response.render('admin/category', { data: data, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords, page, limit } = request.body;

        page = page || 0; limit = limit || 50;

        var data = await CategoryService.getList({
            keywords, page, limit
        });

        response.render('admin/category/binddata', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.create = async (request, response, next) => {
    try {
        const categoriesList = await CategoryService.getList({
            id: ''
        });
        response.render('admin/category/create', { data: categoriesList, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.createPost = async (request, response, next) => {
    try {
        const category = {
            name, description, slug, parent,
            displayOrder, image, controllerAction,
            metaTitle, metaDescription, metaKeywords,
            h1Tag, canonical, isIndex
        } = request.body;

        if(category.parent.trim().length <=0) {
            category.parent = null;
        }

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        await CategoryService.putCategory(category);

        return response.json({ success: true, message: 'Tạo chuyên mục thành công', cb: '/stv/category/binddata' });

    } catch (error) {
        next(error);
    }
}

module.exports.edit = async (request, response, next) => {
    try {
        const { id } = request.params;
        if (!id) {
            return next(new Error('Không tìm thấy chuyên mục phù hợp.'));
        }

        const category = await CategoryService.getById(id);
        const data = await CategoryService.getList({
            id: ''
        });

        // const [category, data] = await Promise.all[
        //     CategoryService.getById(id),
        //     CategoryService.getList({
        //         id: ''
        //     })
        // ];

        response.render('admin/category/edit', { category: category, data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.editPost = async (request, response, next) => {
    try {
        let category = {
            id, name, description, slug, parent,
            displayOrder, image, controllerAction,
            metaTitle, metaDescription, metaKeywords,
            h1Tag, canonical, isIndex
        } = request.body;

        if(category.parent.trim().length <=0) {
            category.parent = null;
        }

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        const categoryFind = await CategoryService.getById(id);

        if(categoryFind){
            // categoryFind.name=category.name;
            // categoryFind.description = category.description;
            // categoryFind.slug = category.slug;
            // categoryFind.parent = category.parent;
            // categoryFind.displayOrder = category.displayOrder;
            // categoryFind.image = category.image;
            // categoryFind.metaTitle = category.metaTitle;
            // categoryFind.metaDescription = category.metaDescription;
            // categoryFind.metaKeywords = category.metaKeywords;
            // categoryFind.h1Tag = category.h1Tag;
            // categoryFind.canonical = category.canonical;

            await CategoryService.patchCategory(category);
            return response.json({ success: true, message: 'Tạo chuyên mục thành công', cb: '/stv/category/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}