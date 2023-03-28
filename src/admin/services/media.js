const { promiseImpl } = require('ejs');
const { Media } = require('../models');

class MediaService {
    static getList = async ({
        keywords = '',
        page = 0,
        limit = 50
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            const data = await Promise.all([
                Media.find(query, {
                    name: 1,
                    path: 1,
                    content: 1,
                    size: 1,
                    contentType: 1,
                    createdAt: 1
                })
                    .sort({
                        createdAt: 'desc'
                    })
                    .skip(page > 0 ? ((page - 1) * limit) : 0)
                    .limit(limit),

                Media.countDocuments(query)
            ]);

            page = page <= 0 ? 1 : page;

            return { medias: data[0], pages: Math.ceil(data[1] / limit), currentPage: page };
        } catch (error) {
            console.error(`MediaService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static insert = async (media) => {
        try {
            return await Media.create(media);
        } catch (error) {
            console.error(`MediaService::insert::${error}`);
            return Promise.reject(error);
        }
    }

    static update = async (media) => {
        try {
            return await Media.updateOne({
                _id: media.id
            }, {
                name: media.name,
                path: media.page,
                content: media.content,
                size: media.size,
                contentType: media.size,
                updatedBy: media.updatedBy,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error(`MediaService::update::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = MediaService;