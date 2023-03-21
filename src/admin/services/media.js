const { Media } = require('../models');

class MediaService {
    static getList = async ({
        keywords = '',
        page = 1,
        limit = 50,
        skip = 0
    }) => {
        try {
            const medias = await Media.find({}, {
                name: 1,
                path: 1,
                content: 1,
                size: 1,
                contentType: 1,
                createdAt: 1
            })
                .sort({
                    createdAt: 'desc'
                });

            return medias;
        } catch (error) {
            console.error(`MediaService::getList::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = MediaService;