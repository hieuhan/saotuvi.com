const { validationResult } = require('express-validator');
const MenuService = require('../services/menu');
const CategoryService = require('../services/category');
//const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        const { keywords = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        const data = await MenuService.getList({
            keywords, page, limit, isDeleted
        });

        const dataInput = { keywords, page, limit, isDeleted };

        response.render('admin/menu', { data: data, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords = '', page = 0, limit = 50, isDeleted = 0 } = request.query;

        var data = { categories, totalPages, currentPage } = await MenuService.getList({
            keywords, page, limit, isDeleted
        });

        response.render('admin/menu/binddata', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.create = async (request, response, next) => {
    try {
        const data = await Promise.all([
            CategoryService.getList({
                id: ''
            }),

            MenuService.getList({
                id: ''
            })
        ]);

        response.render('admin/menu/create', { data: { categories: data[0], menus: data[1] }, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.createPost = async (request, response, next) => {
    try {
        const menu = {
            name, description, slug, parent, category, position,
            displayOrder, image
        } = request.body;

        if (menu.parent.trim().length <= 0) {
            menu.parent = null;
        }

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        await MenuService.putMenu(menu);

        return response.json({ success: true, message: 'Tạo menu thành công', cb: '/stv/menu/binddata' });

    } catch (error) {
        next(error);
    }
}