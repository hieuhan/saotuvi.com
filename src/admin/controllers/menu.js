const { validationResult } = require('express-validator');
const MenuService = require('../services/menu');
const CategoryService = require('../services/category');
//const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        const { keywords = '', page = 0, position = '', isDraft = 0 } = request.query;

        const data = await MenuService.getList({
            keywords, position, page, isDraft
        });

        const dataInput = { keywords, position, page, isDraft };

        response.render('admin/menu', { data: data, dataInput: dataInput, layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords = '', page = 0, position = '', isDraft = 0 } = request.query;

        var data = { categories, totalPages, currentPage } = await MenuService.getList({
            keywords, position, page, isDraft
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

        if (menu.category.trim().length <= 0) {
            menu.category = null;
        }

        menu.nameLower = name.toLowerCase();

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        await MenuService.insert(menu);

        return response.json({ success: true, message: 'Tạo menu thành công', cb: '/stv/menu/binddata' });

    } catch (error) {
        next(error);
    }
}

module.exports.edit = async (request, response, next) => {
    try {
        const { id } = request.params;
        if (!id) {
            return next(new Error('Không tìm thấy menu phù hợp.'));
        }

        const menu = await MenuService.getById(id);

        if(!menu){
            return next(new Error('Không tìm thấy menu phù hợp.'));
        }

        const data = await Promise.all([
            CategoryService.getList({
                id: ''
            }),
            MenuService.getParents({ id: menu._id, level: menu.level })
        ]);

        response.render('admin/menu/edit', { menu: menu, categories: data[0], parents: data[1], layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.editPost = async (request, response, next) => {
    try {
        let menu = {
            id, name, description, slug, parent, category, position,
            displayOrder, image
        } = request.body;

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        if (menu.parent.trim().length <= 0) {
            menu.parent = null;
        }

        if (menu.category.trim().length <= 0) {
            menu.category = null;
        }

        menu.nameLower = menu.name.toLowerCase();

        const menuFind = await MenuService.getById(id);

        if (menuFind) {
            await MenuService.update(menu);
            return response.json({ success: true, message: 'Cập nhật menu thành công', cb: '/stv/menu/binddata' });
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

        const menuFind = await MenuService.getById(id);

        if (menuFind) {
            await MenuService.draft(id, request.user.username);
            return response.json({ success: true, message: 'Lưu nháp menu thành công', dataUrl: '/stv/menu/binddata' });
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

        const menuFind = await MenuService.getById(id);

        if (menuFind) {
            await MenuService.recover(id, request.user.username);
            return response.json({ success: true, message: 'Hủy lưu nháp menu thành công', dataUrl: '/stv/menu/binddata' });
        }

        return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
    } catch (error) {
        next(error);
    }
}