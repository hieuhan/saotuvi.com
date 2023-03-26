const { Category } = require('../models')

class CategoryService {
    static getById = async (id) => {
        try {
            return await Category.findOne({ _id: id });
        } catch (error) {
            console.error(`CategoryService::getById::${error}`);
            return Promise.reject(error);
        }
    }

    static getList = async ({
        id = '',
        keywords = '',
        isDeleted = 0,
        page = 0,
        limit = 50
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            if (id.trim().length > 0) {
                query['treeOrder'] = new RegExp(id, 'i');
            }

            if (isDeleted == 1) {
                query['isDeleted'] = true;
            }
            // const data = await Promise.all([
            //     Category.find(query, {
            //         name: 1,
            //         description: 1,
            //         slug: 1,
            //         image: 1,
            //         parent: 1,
            //         parentSlug: 1,
            //         level: 1,
            //         treeOrder: 1,
            //         displayOrder: 1,
            //         isDeleted: 1,
            //         createdAt: 1,
            //         deletedAt: 1,
            //         deletedBy: 1
            //     }).populate('parent', '_id name')
            //         .skip(page * (limit - 1))
            //         .limit(limit)
            //         .sort({
            //             treeOrder: 'asc'
            //         }),
            //     Category.countDocuments(query)
            // ])

            //return { categories: data[0], totalPages: Math.ceil(data[1] / limit), currentPage: page };

            const categories = await Category.find(query, {
                name: 1,
                description: 1,
                slug: 1,
                image: 1,
                parent: 1,
                parentSlug: 1,
                level: 1,
                treeOrder: 1,
                displayOrder: 1,
                isDeleted: 1,
                createdAt: 1,
                deletedAt: 1,
                deletedBy: 1
            }).populate('parent', '_id name')
                //.skip(page * (limit - 1))
                //.limit(limit)
                .sort({
                    treeOrder: 'asc'
                });

            return categories;
        } catch (error) {
            console.error(`CategoryService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static putCategory = async (category) => {
        try {
            const createResult = await Category.create(category);
            if (createResult) {
                await this.patchTreeOrder({
                    id: createResult._id,
                    parentId: createResult.parent,
                    displayOrder: createResult.displayOrder,
                    createdAt: createResult.createdAt
                });
            }
        } catch (error) {
            console.error(`:::CategoryService.putCategory:::${error}`);
            return Promise.reject(error);
        }
    }

    static patchTreeOrder = async ({
        id, parentId = null, displayOrder = 0, createdAt = new Date()
    }) => {
        try {
            let level = id,
                treeOrder = `${displayOrder}:${createdAt.toISOString()}:${id}`;
            const parent = await Category.findOne({ _id: parentId });

            if (parent) {
                treeOrder = `${parent.treeOrder}/${treeOrder}`;
                level = `${parent.level}/${level}`;
            }

            const category = await Category.updateOne({
                _id: id
            }, {
                level,
                treeOrder
            });

            return category;
        } catch (error) {
            console.error(`CategoryService::putCategory::${error}`);
            return Promise.reject(error);
        }
    }

    static patchCategory = async (category) => {
        try {
            const patchResult = await Category.updateOne({ _id: category.id }, category);

            if (patchResult) {
                await this.patchTreeOrder({
                    id: category.id,
                    parentId: category.parent != null ? category.parent.toString() : null,
                    displayOrder: category.displayOrder || 0,
                    createdAt: category.createdAt
                });
            }

        } catch (error) {
            console.error(`:::CategoryService.patchCategory:::${error}`);
            return Promise.reject(error);
        }
    }

    static deleteCategory = async (id, deletedBy) => {
        try {
            return await Category.updateOne({ _id: id, isDeleted: false }, {
                isDeleted: true,
                deletedBy: deletedBy,
                deletedAt: new Date()
            })
        } catch (error) {
            console.error(`CategoryService::deleteCategory::${error}`);
            return Promise.reject(error);
        }
    }

    static recoverDeleteCategory = async (id, recoverDeletedBy) => {
        try {
            return await Category.updateOne({ _id: id, isDeleted: true }, {
                isDeleted: false,
                recoverDeletedBy: recoverDeletedBy,
                recoverDeletedAt: new Date()
            })
        } catch (error) {
            console.error(`CategoryService::recoverDeleteCategory::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = CategoryService;