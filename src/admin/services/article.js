const { Article } = require('../models');

class ArticleService {
    static getById = async (id) => {
        try {
            return await Article.findOne({ _id: id });
        } catch (error) {
            console.error(`ArticleService::getById::${error}`);
            return Promise.reject(error);
        }
    }

    static getPage = async ({
        keywords = '',
        category = '',
        isDeleted = 0,
        page = 0,
        limit = 50
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            if (category.trim().length > 0) {
                query['category'] = category;
            }

            if (isDeleted == 1) {
                query['isDeleted'] = true;
            }

            const articles = await Article.find(query, {
                title: 1,
                summary: 1,
                slug: 1,
                image: 1,
                category: 1,
                //categories: 1,
                displayOrder: 1,
                isDeleted: 1,
                createdAt: 1,
                deletedAt: 1,
                deletedBy: 1
            }).populate('category', '_id name  slug')
                .skip(page * (limit - 1))
                .limit(limit)
                .sort({
                    publishedAt: 'asc',
                    createdAt: 'asc'
                });

            return articles;
        } catch (error) {
            console.error(`ArticleService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static insert = async (article) => {
        try {
            return await Article.create(article);
        } catch (error) {
            console.error(`:::ArticleService.insert:::${error}`);
            return Promise.reject(error);
        }
    }

    static update = async (article) => {
        try {
            return await Article.updateOne({ _id: article.id }, article);
        } catch (error) {
            console.error(`:::ArticleService.update:::${error}`);
            return Promise.reject(error);
        }
    }

    static delete = async (id, deletedBy) => {
        try {
            return await Article.updateOne({ _id: id, isDeleted: false }, {
                isDeleted: true,
                deletedBy: deletedBy,
                deletedAt: new Date()
            })
        } catch (error) {
            console.error(`ArticleService::delete::${error}`);
            return Promise.reject(error);
        }
    }

    static recover = async (id, recoverDeletedBy) => {
        try {
            return await Article.updateOne({ _id: id, isDeleted: true }, {
                isDeleted: false,
                recoverDeletedBy: recoverDeletedBy,
                recoverDeletedAt: new Date()
            })
        } catch (error) {
            console.error(`ArticleService::recover::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = ArticleService;