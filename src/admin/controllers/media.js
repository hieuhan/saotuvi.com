const MediaService = require('../services/media');
//const { Media }  = require('../models');

module.exports.index = async (request, response, next) => {
    try {
        //await Media.deleteMany();
        let { keywords, page = 0 } = request.params;

        var data = { medias, pages, currentPage } = await MediaService.getList({
            keywords, page
        });

        response.render('admin/media', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.binddata = async (request, response, next) => {
    try {
        let { keywords, page = 0 } = request.body;

        var data = await MediaService.getList({
            keywords, page
        });

        response.render('admin/media/binddata', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.upload = async (request, response, next) => {
    try {
        if (!request.body && !request.files || request.files.length <= 0) {
            return response.json({ success: false, message: 'Vui lòng chọn file ảnh.' });
        }
        
        const promises = [];

        for (var index = 0; index < request.files.length; index++) {
            promises.push(MediaService.insert({
                name: request.files[index].originalname.substr(0, request.files[index].originalname.lastIndexOf('.')) || request.files[index].originalname,
                path: request.files[index].path.replace('src\\public\\', '').replace('src/public/', '').replaceAll('\\', '/'),
                contentType: request.files[index].mimetype,
                size: request.files[index].size
            }));
        }

        if (!promises.length) {
            return response.json({ success: false, message: 'Vui lòng thử lại sau.' });
        }

        await Promise.all(promises);

        return response.json({
            success: true,
            cb: '/stv/media/binddata'
        });
    } catch (error) {
        next(error);
    }
}