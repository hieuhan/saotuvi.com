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
        position = '',
        isDraft = 0
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            if (id.trim().length > 0) {
                query['treeOrder'] = new RegExp(id, 'i');
            }

            if (position.trim().length > 0) {
                query['position'] = position;
            }

            if (isDraft == 1) {
                query['isDraft'] = true;
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
                position: 1,
                displayOrder: 1,
                isDraft: 1,
                createdAt: 1,
            }).populate('parent', '_id name')
                .populate('category', '_id name slug')
                .sort({
                    treeOrder: 'asc'
                });

            return menus;
        } catch (error) {
            console.error(`MenuService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static getParents = async ({
        id = '',
        level = ''
    }) => {
        try {
            const query = {};

            query['level'] = { $exists: true };
            query['$expr'] = { $lte: [{ $strLenCP: '$level' }, level.toString().length] };
            query['_id'] = { $ne: id };

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
                isDraft: 1,
                createdAt: 1
            })
                .sort({
                    treeOrder: 'asc'
                });

            return menus;
        } catch (error) {
            console.error(`MenuService::getParents::${error}`);
            return Promise.reject(error);
        }
    }

    static insert = async (menu) => {
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
            console.error(`:::MenuService.insert:::${error}`);
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

    static update = async (menu) => {
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
            console.error(`:::MenuService.update:::${error}`);
            return Promise.reject(error);
        }
    }

    static draft = async (id, draftedBy) => {
        try {
            return await Menu.updateOne({ _id: id, isDraft: false }, {
                isDraft: true,
                draftedBy: draftedBy,
                draftedAt: new Date()
            })
        } catch (error) {
            console.error(`MenuService::draft::${error}`);
            return Promise.reject(error);
        }
    }

    static recover = async (id, recoverDraftedBy) => {
        try {
            return await Menu.updateOne({ _id: id, isDraft: true }, {
                isDraft: false,
                recoverDraftedBy: recoverDraftedBy,
                recoverDraftedAt: new Date()
            })
        } catch (error) {
            console.error(`MenuService::recover::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = MenuService;