const { validationResult } = require('express-validator');
const CategoryService = require('../services/category');
//const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        //await Category.deleteMany();

        // const category = await categoryService.putCategory({
        //     name: 'Tử vi',
        //     description: 'Tử vi',
        //     slug: 'tu-vi',
        //     parent: null
        // });

        // const category = await categoryService.putCategory({
        //     name: 'Tử vi 12 con giáp',
        //     description: 'Tử vi 12 con giáp',
        //     slug: 'tu-vi-12-con-giap',
        //     parent: '641958e1ee7c67e326c930a6',
        //     displayOrder: 2
        // });

        // const category = await categoryService.putCategory({
        //     name: 'dev',
        //     description: 'dev',
        //     slug: 'dev',
        //     parent: '6419593de78efa7e8cb44a4a',
        //     displayOrder: 0
        // });
        
        // const category = await Category.create({
        //     name: 'demo 5',
        //     description: 'demo 5',
        //     slug: 'demo-5',
        //     displayOrder: 5,
        //     parent: '6418a050ea376488b210486f'
        // });

        // const treeOrder = await categoryService.patchTreeOrder({
        //     id: category._id,
        //     level: category.level,
        //     parent: category.parent,
        //     createdAt: category.createdAt
        // });

        const list = await CategoryService.getList({
            id: ''
        });

        console.log(list)
        response.render('admin/category', { list: list, layout: './admin/layouts/default' });
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
        const category = { name, description, slug, parent, 
            displayOrder, image, controllerAction,
            metaTitle, metaDescription, metaKeywords,
            h1Tag, canonical, isIndex
         } = request.body;
         
         const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.json({ success: false, error: errors.mapped() });
        }

        await CategoryService.putCategory(category);

        return response.json({ success: true, message: 'Tạo chuyên mục thành công', cb: Buffer.from('username:password', 'utf8').toString('base64')  });

    } catch (error) {
        next(error);
    }
}

module.exports.edit = async (request, response, next) => {
    try {
        const { id } = request.params;

        //if(id)
        //{
            //const categoryById = await Category.findOne({ id });

            //console.log(categoryById)
        //}

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