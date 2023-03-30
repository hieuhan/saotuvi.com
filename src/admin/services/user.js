const { User } = require('../models')

class UserService {
    static getById = async (id) => {
        try {
            return await User.findOne({ _id: id });
        } catch (error) {
            console.error(`UserService::getById::${error}`);
            return Promise.reject(error);
        }
    }

    static getList = async ({
        keywords = '',
        isDraft = 0
    }) => {
        try {
            const query = {};

            if (keywords.trim().length > 0) {
                query['$text'] = { $search: keywords };
            }

            if (isDraft == 1) {
                query['isDraft'] = true;
            }

            const data = await Promise.all([
                User.find(query, {
                    username: 1,
                    email: 1,
                    avatar: 1,
                    createdAt: 1
                })
                    .sort({
                        createdAt: 'desc'
                    })
                    .skip(page > 0 ? ((page - 1) * limit) : 0)
                    .limit(limit),

                    User.countDocuments(query)
            ]);

            page = page <= 0 ? 1 : page;

            return { users: data[0], pages: Math.ceil(data[1] / limit), currentPage: page };
        } catch (error) {
            console.error(`UserService::getList::${error}`);
            return Promise.reject(error);
        }
    }

    static insert = async (user) => {
        try {
            return await User.create(user);
        } catch (error) {
            console.error(`:::UserService.insert:::${error}`);
            return Promise.reject(error);
        }
    }

    static update = async (user) => {
        try {
            return await User.updateOne({ _id: user.id }, user);
        } catch (error) {
            console.error(`:::UserService.update:::${error}`);
            return Promise.reject(error);
        }
    }

    static draft = async (id, draftedBy) => {
        try {
            return await User.updateOne({ _id: id, isDraft: false }, {
                isDraft: true,
                draftedBy: draftedBy,
                draftedAt: new Date()
            })
        } catch (error) {
            console.error(`UserService::draft::${error}`);
            return Promise.reject(error);
        }
    }

    static recover = async (id, recoverDraftedBy) => {
        try {
            return await User.updateOne({ _id: id, isDraft: true }, {
                isDraft: false,
                recoverDraftedBy: recoverDraftedBy,
                recoverDraftedAt: new Date()
            })
        } catch (error) {
            console.error(`UserService::recover::${error}`);
            return Promise.reject(error);
        }
    }
}

module.exports = UserService;