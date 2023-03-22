const { model } = require('mongoose');
const sharp = require('sharp');
const MediaService = require('../services/media');

module.exports.index = async (request, response, next) => {
    try {
        const { keywords, page, limit } = request.params;

        var data = await MediaService.getList({});

        response.render('admin/media', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.indexPost = async (request, response, next) => {
    try {
        const { keywords, page, limit } = request.params;

        var data = await MediaService.getList({});

        response.render('admin/media', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.upload = async (request, response, next) => {
    try {
        //console.log(request.files)
        // if (!request.body && !request.files) {
        //     response.json({ success: false, message: 'Vui lòng thử lại sau.' });
        // } else {
        //     console.log(request.files)
        //     /* res.json({ success: true, files: req.files }); */
        //     /* req.files các file upload return về một array, qua đó chúng ta có thể dễ dàng xử lý  */
        //     /* chú ý: nhớ rename file lại không nữa sinh ra lỗi. ở đay mình rename theo kích thuước mình resize. */
        //     sharp(request.files[0].path).resize(262, 317).toFile('./src/public/uploads/' + '262x317-' + request.files[0].filename, function (error) {
        //         if (error) {
        //             console.error('sharp>>>', error)
        //         }
        //         console.log('ok okoko')
        //     })

        // }
        //return response.json({ success: true, message: 'Tạo chuyên mục thành công', cb: Buffer.from('username:password', 'utf8').toString('base64') });
    } catch (error) {
        next(error);
    }
}