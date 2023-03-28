const { validationResult } = require('express-validator');
const CategoryService = require('../services/category');
//const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        //await Category.deleteMany();
        const { keywords = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        // const data =  { categories, totalPages, currentPage } = await CategoryService.getList({
        //     keywords, page, limit, isDeleted
        // });

        const data = await CategoryService.getList({
            keywords, page, limit, isDeleted
        });

        const dataInput = { keywords, page, limit, isDeleted };

        response.render('admin/category', { data: data, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.trash = async (request, response, next) => {
    try {
        const { keywords = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        var data = await CategoryService.getList({
            keywords, page, limit, isDeleted
        });

        const dataInput = { keywords, page, limit, isDeleted };

        response.render('admin/category/trash', { data: data, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        var data = { categories, totalPages, currentPage } = await CategoryService.getList({
            keywords, page, limit, isDeleted
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

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        if (category.parent.trim().length <= 0) {
            category.parent = null;
        }

        category.nameLower = name.toLowerCase();

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

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        const categoryFind = await CategoryService.getById(id);

        if (categoryFind) {

            category.nameLower = name.toLowerCase();

            if (category.parent.trim().length <= 0) {
                category.parent = null;
            }

            await CategoryService.patchCategory(category);
            return response.json({ success: true, message: 'Tạo chuyên mục thành công', cb: '/stv/category/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}

module.exports.delete = async (request, response, next) => {
    try {
        let { id } = request.params;

        if (!id) {
            return response.json({ success: false, error: 'Vui lòng thử lại sau.' });
        }

        const categoryFind = await CategoryService.getById(id);

        if (categoryFind) {
            await CategoryService.deleteCategory(id, request.user.username);
            return response.json({ success: true, message: 'Xóa chuyên mục thành công', cb: '/stv/category/binddata' });
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

        const categoryFind = await CategoryService.getById(id);

        if (categoryFind) {
            await CategoryService.recoverDeleteCategory(id, request.user.username);
            return response.json({ success: true, message: 'Phục hồi dữ liệu chuyên mục thành công', cb: '/stv/category/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}