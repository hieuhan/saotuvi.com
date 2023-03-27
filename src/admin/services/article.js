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
        isDraft = 0,
        page = 0,
        limit = 50
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            if (category.trim().length > 0) {
                query['subCategory'] = { '$in': [`${ category }`] };
            }

            if (isDraft == 1) {
                query['isDraft'] = true;
            }

            const data = await Promise.all([
                Article.find(query, {
                    title: 1,
                    summary: 1,
                    slug: 1,
                    image: 1,
                    category: 1,
                    subCategory: 1,
                    displayOrder: 1,
                    isDraft: 1,
                    createdAt: 1,
                    draftedBy: 1,
                    draftedAt: 1
                }).populate('subCategory', '_id name  slug')
                    .skip(page * (limit - 1))
                    .limit(limit)
                    .sort({
                        publishedAt: 'desc',
                        createdAt: 'desc'
                    }),
                Article.countDocuments(query)
            ]);

            return { list: data[0], pages: Math.ceil(data[1] / limit), currentPage: page };
        } catch (error) {
            console.error(`ArticleService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static insert = async (article) => {
        try {
            console.log(article)
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

    static draft = async (id, draftedBy) => {
        try {
            return await Article.updateOne({ _id: id, isDraft: false }, {
                isDraft: true,
                draftedBy: draftedBy,
                draftedAt: new Date()
            })
        } catch (error) {
            console.error(`ArticleService::draft::${error}`);
            return Promise.reject(error);
        }
    }

    static recover = async (id, recoverDraftedBy) => {
        try {
            return await Article.updateOne({ _id: id, isDraft: true }, {
                isDraft: false,
                recoverDraftedBy: recoverDraftedBy,
                recoverDraftedAt: new Date()
            })
        } catch (error) {
            console.error(`ArticleService::recover::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = ArticleService;