const { Menu } = require('../models')

class MenuService {
    static getById = async (id) => {
        try {
            return await Menu.findOne({ _id: id });
        } catch (error) {
            console.error(`MenuService::getById::${error}`);
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

            const menus = await Menu.find(query, {
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
                .skip(page * (limit - 1))
                .limit(limit)
                .sort({
                    treeOrder: 'asc'
                });

            return menus;
        } catch (error) {
            console.error(`MenuService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static putMenu = async (menu) => {
        try {
            const createResult = await Menu.create(menu);
            if (createResult) {
                await this.patchTreeOrder({
                    id: createResult._id,
                    parentId: createResult.parent,
                    displayOrder: createResult.displayOrder,
                    createdAt: createResult.createdAt
                });
            }
        } catch (error) {
            console.error(`:::MenuService.putMenu:::${error}`);
            return Promise.reject(error);
        }
    }

    static patchTreeOrder = async ({
        id, parentId = null, displayOrder = 0, createdAt = new Date()
    }) => {
        try {
            let level = id,
                treeOrder = `${displayOrder}:${createdAt.toISOString()}:${id}`;
            const parent = await Menu.findOne({ _id: parentId });

            if (parent) {
                treeOrder = `${parent.treeOrder}/${treeOrder}`;
                level = `${parent.level}/${level}`;
            }

            const menu = await Menu.updateOne({
                _id: id
            }, {
                level,
                treeOrder
            });

            return menu;
        } catch (error) {
            console.error(`MenuService::patchTreeOrder::${error}`);
            return Promise.reject(error);
        }
    }

    static patchMenu = async (menu) => {
        try {
            const patchResult = await Menu.updateOne({ _id: menu.id }, menu);

            if (patchResult) {
                await this.patchTreeOrder({
                    id: menu.id,
                    parentId: menu.parent != null ? menu.parent.toString() : null,
                    displayOrder: menu.displayOrder || 0,
                    createdAt: menu.createdAt
                });
            }

        } catch (error) {
            console.error(`:::MenuService.patchMenu:::${error}`);
            return Promise.reject(error);
        }
    }

    static delete = async (id, deletedBy) => {
        try {
            return await Menu.updateOne({ _id: id, isDeleted: false }, {
                isDeleted: true,
                deletedBy: deletedBy,
                deletedAt: new Date()
            })
        } catch (error) {
            console.error(`MenuService::delete::${error}`);
            return Promise.reject(error);
        }
    }

    static recoverDelete = async (id, recoverDeletedBy) => {
        try {
            return await Menu.updateOne({ _id: id, isDeleted: true }, {
                isDeleted: false,
                recoverDeletedBy: recoverDeletedBy,
                recoverDeletedAt: new Date()
            })
        } catch (error) {
            console.error(`MenuService::recoverDelete::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = MenuService;