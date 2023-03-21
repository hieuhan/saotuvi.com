const { Category } = require('../models')

class categoryService {
    static getList = async ({
        id = '',
        parentSlug = '',
        treeOrder = '',
        limit = 50,
        skip = 0
    }) => {
        try {
            const match = {}

            if(id != '')
            {
                match['treeOrder'] = new RegExp(id, 'i')
            }

            const categories = await Category.find(match, {
                name: 1,
                description: 1,
                slug: 1,
                parent: 1,
                parentSlug: 1,
                level: 1,
                treeOrder: 1,
                displayOrder: 1,
                createdAt: 1
            }).populate('parent', '_id name')
            .sort({
                displayOrder: 'asc',
                treeOrder: 'asc'
            });

            return categories;
        } catch (error) {
            console.error(`categoryService::getList::${error}`);
        }
    }

    static patchTreeOrder = async ({
        id,
        level = '',
        parent = '',
        createdAt = new Date()
    }) => {
        try {
            //await Category.deleteMany();
            let treeOrder = `${createdAt.toISOString()}:${id}`;
            const parentSlug = await Category.findOne({ _id: parent });

            if(parentSlug){
                treeOrder = `${ parentSlug.treeOrder }/${treeOrder}`;
                level = `${parentSlug.level}/${id}`;
            }

            console.log(treeOrder);

            const category = await Category.updateOne({
                _id : id
            }, {
                level,
                treeOrder
            });

            //console.log(category)

            return category;
        } catch (error) {
            console.error(`categoryService::putCategory::${error}`);
        }

    }
}

module.exports = categoryService;