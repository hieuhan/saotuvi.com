const categoryService = require('../services/category');
const {Category} = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        //await Category.deleteMany();

        // const category = await Category.create({
        //     name: 'Cung hoàng đạo',
        //     description: 'Cung hoàng đạo',
        //     slug: 'cung-hoang-dao',
        //     parent: null
        // });

        // const category = await Category.create({
        //     name: 'Bảo bình',
        //     description: 'Bảo bình',
        //     slug: 'bao-binh',
        //     parent: '6418a0241be1c28bcad4b219'
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

        const list = await categoryService.getList({
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