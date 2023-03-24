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
                    .skip(page * (limit - 1))
                    .limit(limit),

                Media.countDocuments(query)
            ]);

            return { medias: data[0], totalPages: Math.ceil(data[1] / limit), currentPage: page };
        } catch (error) {
            console.error(`MediaService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static putMedia = async (media) => {
        try {
            return await Media.create(media);
        } catch (error) {
            console.error(`MediaService::putMedia::${error}`);
            return Promise.reject(error);
        }
    }

    static patchMedia = async (media) => {
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
            console.error(`MediaService::patchMedia::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = MediaService;